
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
    if (next) return nightmare(opts)
      .goto(next)
      .evaluate(query)
      .end()
      .run(nextPage)
    collect(error, allUrls)
  }

  function collect (error, urls) {
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      if (typeof error === 'string') error = JSON.parse(error)
      if (error && (error.details != 'ERR_CONNECTION_RESET') && (error.details != 'ERR_NETWORK_CHANGED') && (error.message != 'navigation error')) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) {
        next(urls.pop(), callback)
      }
      else {
        done(null, { NAME, DATA })
      }
    }
  }

}

function next (url, cbFn) {
  nightmare()
  .goto(url)
  //.wait('body')
  .evaluate(query)
  .end()
  .run(analyze)

  function query (){
    return {
      date: null,
      skills: null,
      requirements: null,
      title: null,
      type: null,
      payment: null,
      duration: null,
      budget: null,
      description: ((document.querySelector('body')||{}).innerText||'')||'',
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
  var nodeList = document.querySelectorAll('.js-job-link')
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var array = document.querySelectorAll('.search-pagination li a')||[]
  var next = (document.querySelector('.next-pagination')||{}).href
  return { urls, next } // same as `{ urls:urls, next:next }`
}
