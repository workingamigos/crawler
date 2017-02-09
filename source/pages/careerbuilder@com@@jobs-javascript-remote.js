/******************************************************************************
  https://careerbuilder.com/jobs-javascript-remote

******************************************************************************/
var nightmare = require('nightmare')

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

  //because of .run, we need 2 arguments: err & result
  function nextPage (error, data) {
    if (error) return done(error)
    allUrls = allUrls.concat(data.urls)
    console.log(`collected urls: ${allUrls.length}`)
    var next = data.next
    console.log(next)
    if (next) return nightmare(opts)
      .goto(next)
      .wait('.job-title a')
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
    if (urls.length) next(urls.shift(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) next(urls.shift(), callback)
      else done(null, { NAME, DATA })
    }
  }

}

function next (url, cbFn) {
  nightmare()
  .goto(url)
  .wait('.card .item')
  .evaluate(query)
  .end()
  .run(cbFn)

  function query (){
    return {
      date: (document.querySelector('.main #job-begin-date')||{}).innerText||null,
      skills: null,
      requirements: null,
      title: (document.querySelector('.main h1')||{}).innerText||null,
      type: (document.querySelectorAll('.job-facts .tag')[0]||{}).innerText||null,
      payment: null, // fixed / per hour
      duration: null,
      budget: [...document.querySelectorAll('.job-facts .tag')]
        .map(element => {
          if (element && element.innerText) {
            return element.innerText.includes('$') ? element.innerText : null
          }
          return null
        }),
      description: (document.querySelector('.main .description')||{}).innerText||'',
      details: null,
      company: ((document.querySelector('.main #job-company-name')||{}).innerText||'').split('•')[0]||null,
      location: ((document.querySelector('.main #job-company-name')||{}).innerText||'').split('•')[1]||null,
      benefits: null,
      url: location.href
    }
  }

}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.job-title a')
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var array = document.querySelectorAll('.pager a')||[]
  if (array[array.length - 1].getAttribute('aria-disabled') === 'false') {
    var next = (array[array.length - 1] === 'false'||{}).href
  }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
