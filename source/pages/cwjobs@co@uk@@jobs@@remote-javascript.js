/******************************************************************************
  https://www.cwjobs.co.uk/jobs/remote-javascript
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

  opts.show = true // @TODO: remove this - its only for debuggging

  nightmare(opts)
  .useragent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36")
  .goto(`http://${URL}`)
  .wait('.pagination li a')
  .wait(500000)
  .evaluate(query)
  .end()
  .run(nextPage)

  // @TODO: if cookie is not set, it shows 50 jobs
  // @TODO: it should update/refresh and show only 40 jobs

  var allUrls = []

  function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
    if (error) return done(error)
    allUrls = allUrls.concat(data.urls)
    console.log(`collected urls: ${allUrls.length}`)
    var next = data.next
    console.log(data.m3h)
    if (next) return nightmare(opts)
      .useragent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36")
      .goto(next)
      .wait('.job-title a')
      .wait(500000)
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
  console.log('URL IS ' + url)
  nightmare()
  .goto(url)
  .evaluate(query)
  .end()
  .run(analyze)

  function query () {
    return {
      date: (document.querySelector('.job-content .date-posted')||{}).innerText||null,
      skills: null,
      requirements: null,
      title: (document.querySelector('.job-content h1')||{}).innerText||null,
      type: (document.querySelector('.job-content .job-type')||{}).innerText||null,
      payment: null, // fixed / per hour
      duration: null,
      budget: (document.querySelector('.location-salary .salary')||{}).innerText||null,
      description: (document.querySelector('.job-description')||{}).innerText||null,
      details: null,
      company: (document.querySelector('.job-content .company')||{}).innerText||null,
      location: (document.querySelector('.location-salary .location')||{}).innerText||null,
      benefits: null
    }
  }
  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var base = window.location.protocol + '//' + window.location.host + window.location.pathname
  var urls = []
  var nodeList = document.querySelectorAll('.job-title a')
  ;(nodeList||[]).forEach(function (x) { urls.push(x.href) })
  var array = [...document.querySelectorAll('.pagination li a')]
  var next
  var m3h = array.map(x=>{
    return {
      current: window.location+'',
      href: base + x.getAttribute('href'),
      class: x.getAttribute('class')
    }
  })
  var m3h = window.navigator.userAgent
  if (array[array.length - 1].getAttribute('class') !== 'btn btn-default next disabled') {
    next = base + (array[array.length - 1]).getAttribute('href')
  } else {
    next = {}.href
  }
  return { urls, next, m3h } // same as `{ urls:urls, next:next }`
}
