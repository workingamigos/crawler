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
  .wait('.clearfix')
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
      .wait('.title a')
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
      if (error && (error.details != 'ERR_CONNECTION_RESET') && (error.details != 'ERR_NETWORK_CHANGED') && (error.message != 'navigation error')) return done(error)
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
  .wait('.clearfix')
  .evaluate(query)
  .end()
  .run(cbFn)

  function query (){
    return {
      date: ((document.querySelector('.main-content .info')||{}).innerText||'').split('PROPOSALS')[0]||null,
      skills: null,
      requirements: null,
      title: (document.querySelector('.main-content h1')||{}).innerText||'',
      type: null,
      payment: ((document.querySelector('.job-stats')||{}).innerText||'').split('\n')[5]||null,
      duration: null,
      budget: ((document.querySelector('.job-stats')||{}).innerText||'').split('\n')[6]||null,
      description: (document.querySelector('.job-details .clearfix')||{}).innerText||'',
      details: null,
      company: null,
      location: null,
      benefits: null
    }
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.title a')
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var array = document.querySelectorAll('.yiiPager a')||[]
  var next
  if (array[array.length - 1].getAttribute('class') === 'next') {
    next = (array[array.length - 1]).href
  } else {
    next = {}.href
  }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
