/******************************************************************************
  http://www.idealist.org/search/v2

  @TODO:
  https://www.cwjobs.co.uk/jobs/javascript

  @TODO: signup with email and receive job alerts directly

  PROBLEMS:

  var authors = [
    'http://www.idealist.org/view/org/4m99SNcbDbD/',
    'http://www.idealist.org/view/org/kwWJMW2FWZ5P/',
    'http://www.idealist.org/view/org/MpWBXT6FKNH4/',
    'http://www.idealist.org/view/org/MpWBXT6FKNH4/',
    'http://www.idealist.org/view/org/JTpXsgjPGwSP/',
    'http://www.idealist.org/view/org/pcWn8KTwtFsP/'
  ]
  var titles = [
    'http://www.idealist.org/view/job/b59jgtZbgN2D/?csps=20&csi=1&csp=1',
    'http://www.idealist.org/view/job/ZTsSWkMtW23p/?csps=20&csi=2&csp=1',
    'http://www.idealist.org/view/job/8ZtkhfbgCC2D/?csps=20&csi=3&csp=1',
    'http://www.idealist.org/view/job/hnJ3Bj6zp6np/?csps=20&csi=4&csp=1',
    'http://www.idealist.org/view/job/3J4mdxCJHgBD/?csps=20&csi=5&csp=1',
    'http://www.idealist.org/view/job/32NJCb45Gpw4/?csps=20&csi=6&csp=1'
  ]
******************************************************************************/

var ewss = require('electron-websocket-stream')
var mitm = require('mitm-stream')

var path = require('path')


var NAME = path.basename(__filename, '.js')
var URL = `http://www.idealist.org/search/v2`

module.exports = bot

function bot (options) {
  console.log(`SCRAPING: [${NAME}]
    ${URL}
  `)
  return ewss(function electronFn (BrowserifyWindow) {
    var opts = { width: 1000, height: 600 }
    opts.show = true
    var win = BrowserifyWindow(opts)
    win.loadURL(URL)
    win.openDevTools()
    var ws$ = win.webContents.connectFunctionScript(browser)
    return mitm(ws$, function (browser2main$, main2browser$) {
      browser2main$._transform = function (chunk, encoding, next) {
        if (chunk.type === 'paginate') {
          console.log(chunk.body.length)
          ;(chunk.body||[]).forEach(function (x) {
            console.log(x.title)
          })
          if (chunk.next) {
            console.log(chunk.next)
            next(null, chunk)
            // try {
            //   win.loadURL(chunk.next)
            // } catch (e) {
            //   console.log(e)
            //   debugger
            // }
            // console.log('goto:',chunk.next)
          }
        } else if (chunk.type === 'end') {
          var BODY = chunk.body
          var authors = BODY.map(function (data) {
            return data.authorURL
          })
          var titles = BODY.map(function (data) {
            return data.titleURL
          })
          console.log(authors)
          console.log(titles)
          var win2 = BrowserifyWindow(opts)
          win2.show()
          win2.loadURL(titles[0])
          win2.openDevTools()
          // win.destroy()

          console.log('END')
          next(null, BODY)
        }
      }
      main2browser$._transform = function (chunk, encoding, next) {
        console.log('[MITM]', chunk, '[from main main]')
        next(null, chunk)
      }
    })
  }, options)
}

function browser (ws) {
  var parseMessyTime = require('parse-messy-time')

  ws.on('data', function (data) {
    ws.write(`[BROWSER] ${data}`)
  })

  searchJavascript()

  function whileLoading (cb) {
    setTimeout(function () {
      window.requestAnimationFrame(checkProxy)
      function checkProxy () {
          var selector = '#contentHeader[style="opacity: 1;"]'
          var contentHeader = document.querySelector(selector)
          var content = document.querySelector('.content')
          try {
            var isTrue1 = contentHeader.style.opacity === '1'
            var isTrue2 = content.style.opacity === '1'
          } catch (e) { }
          if (isTrue2 && isTrue1) return cb()
          window.requestAnimationFrame(checkProxy)
      }
    },100)
  }

  function searchJavascript () {
    var searchField = 'input[name="search_user_query"]'
    document.querySelector(searchField).value = 'javascript'
    var searchButton = '#searchButton'
    document.querySelector(searchButton).click()
    wait(whileLoading, filterJobs)
  }

  function filterJobs (time) {
    document.querySelector('#f_search_type_job').click()
    wait(whileLoading, filterRemote)
  }

  function filterRemote (time) {
    document.querySelectorAll('.facet-remote input')[2].click()
    wait(whileLoading, start)
  }

  function start (time) {
    var data = [...document.querySelectorAll('.itemsList li')].map(getData)
    var currentPagination = document.querySelector('.footer .pagination ul li.current a')
    if (currentPagination) var next = currentPagination.parentElement.nextElementSibling
    if (next) var url = next.querySelector('a').href
    if (url) {
      ws.end({
        type: 'paginate',
        body: data,
        next: url
      })
    } else {
      ws.end({
        type: 'end',
        body: data
      })
    }
  }

  var dummy = { getAttribute: function () {} }
  function getData (li) {
    try {
      var type = (li.querySelector('.assetType')||dummy).innerText
      var title = (li.querySelector('.assetName a')||dummy).innerText
      var titleURL = (li.querySelector('.assetName a')||dummy).getAttribute('href')
      titleURL = window.location.origin+titleURL
      var teaser = (li.querySelector('.description')||dummy).innerText
      var createdAt = (li.querySelector('.stats .time')||dummy).innerText
      createdAt = parseMessyTime(createdAt)
      var updatedAt = (li.querySelector('.lastupdated .time')||dummy).innerText
      updatedAt = parseMessyTime(updatedAt)
      var author = (li.querySelector('.poster a')||dummy).innerText
      var authorURL = (li.querySelector('.poster a')||dummy).getAttribute('href')
      authorURL = window.location.origin+authorURL
      var location = (li.querySelector('.assetLocation')||dummy).innerText
    } catch (e) {

    }
    return {
      type, title, titleURL,
      teaser, author, authorURL,
      location, createdAt, updatedAt
    }
  }

  return ws
  function wait (queryFn, cb) {
    var start = performance.now()
    queryFn(function () {
      var stop = performance.now()
      cb(stop-start)
    })
  }
}
