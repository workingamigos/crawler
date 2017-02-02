/******************************************************************************
  https://www.cwjobs.co.uk/jobs/remote/in-london

  @TODO:
  ERROR, doesn't finish crawling! Can't debug
  https://www.cwjobs.co.uk/jobs/javascript
******************************************************************************/
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
  .wait('.pagination li a')
  .evaluate(query)
  .end()
  .run(nextPage)



  var allUrls = []

  function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
    if (error) return done(error)
    allUrls = allUrls.concat(data.urls)
    console.log(`collected urls: ${allUrls.length}`)
    var next = data.next
    if (next) return nightmare(opts)
      .goto(next)
      .wait('.job-title a')
      .evaluate(query)
      .end()
      .run(nextPage)

    collect(error, allUrls)
  }

  function collect (error, urls) {
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    console.log("URLS " + urls.length)
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) next(urls.pop(), callback)
      else done(null, { NAME, DATA })
    }
  }

}

function next (url, cbFn) {
  console.log('URL IS ' + url)
  nightmare()
  .goto(url)
  .evaluate(query)
  .end()
  .run(analyze)

  function query () {
    return {
      date: (document.querySelector('.job-content .date-posted')||{}).innerText,
      skills: null,
      requirements: null,
      title: (document.querySelector('.job-content h1')||{}).innerText,
      type: (document.querySelector('.job-content .job-type')||{}).innerText,
      payment: null, // fixed / per hour
      duration: null,
      budget: (document.querySelector('.location-salary .salary')||{}).innerText,
      description: (document.querySelector('.job-description')||{}).innerText,
      details: null,
      company: (document.querySelector('.job-content .company')||{}).innerText,
      location: (document.querySelector('.location-salary .location')||{}).innerText,
      benefits: null
    }
  }
  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.job-title a')
  ;(nodeList||[]).forEach(function (x) { urls.push(x.href) })
  var array = document.querySelectorAll('.pagination li a')||[]
  var next
  if (array[array.length - 1].getAttribute('class') !== 'btn btn-default next disabled') {
    next = (array[array.length - 1]).href
  } else {
    next = {}.href
  }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
