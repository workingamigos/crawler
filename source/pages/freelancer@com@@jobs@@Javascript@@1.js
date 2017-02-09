var nightmare = require('nightmare')

var meta = require('_meta')
var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = execute

function execute (opts, done) {
  if (typeof done !== 'function') return
  opts = opts || { show: false }
  nightmare(opts)
  .goto(`http://${URL}`)
  .evaluate(query)
  .end()
  .run(nextPage)

  var allUrls = []

  function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
    if (error) return done(error)
    allUrls = allUrls.concat(data.urls)
    console.log(`collected urls: ${allUrls.length}`)
    var next = data.next
    console.log(next)
    if (next) return nightmare(opts)
      .goto(next)
      .wait('.ProjectTable-title a')
      .evaluate(query)
      .end()
      .run(nextPage)
    console.log("GOING TO COLLECT NOW")
    collect(error, allUrls)
  }

  function collect (error, urls) {
    console.log("START COLLECTING")
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      if (typeof error === 'string') error = JSON.parse(error)
      if (error && (error.details != 'ERR_CONNECTION_RESET') && (error.details != 'ERR_INTERNET_DISCONNECTED') && (error.message != 'navigation error')) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) next(urls.pop(), callback)
      else {
        console.log("I'M DONE")
        done(null, { NAME, DATA })
      }
    }
  }

}

function next (url, cbFn) {
  nightmare()
  .goto(url)
  .evaluate(query)
  .end()
  .run(analyze)

  function query () {
    return {
      date: null,
      skills: (document.querySelector('.project-view-landing-required-skill')||{}).innerText||null,
      requirements: null,
      title: (document.querySelector('.project-view-project-title')||{}).innerText||null,
      type: null, // job / freelance
      payment: null, // fixed / per hour
      duration: null,
      budget: (document.querySelector('.project-statistic-value')||{}).innerText||null,
      description: (document.querySelector('.project-description')||{}).innerText||'',
      details: null,
      company: null,
      location: null,
      benefits: null,
      url: location.href
    }
  }
  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var urls = []
  console.log("URLS " + urls)
  var nodeList = document.querySelectorAll('.ProjectTable-title a')
  console.log("NODE lIST " + nodeList)
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  console.log("URLS " + urls)
  var array = document.querySelectorAll('.Pagination-item a')||[]
  var next
  if (array[array.length - 2].getAttribute('class') != 'btn next paginate_button Pagination-link disabled') {
    next = (document.querySelectorAll('.Pagination-item a')[array.length - 2]).href
  } else {
    next = {}.href
  }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
