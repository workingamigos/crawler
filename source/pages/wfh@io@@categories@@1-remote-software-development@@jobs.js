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
      .wait('.table td a')
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
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) next(urls.pop(), callback)
      else done(null, { NAME, DATA })
    }
  }
}

function next (url, cbFn) {
  nightmare()
    .goto(url)
    .evaluate(query)
    .end()
    .run(analyze)

  function query (){
    return {
      date: (((document.querySelector('.container .row')||{}).innerText||'').split('Posted')[1]||'').split('Description')[0]||null,
      skills: null,
      requirements: null,
      title: (((document.querySelector('.page-header h1')||{}).innerText)||'').split('@')[0]||null,
      type: null,
      payment: null,
      duration: null,
      budget: null,
      description: (((document.querySelector('.container .row')||{}).innerText||'').split('Description')[1]||'').split('Application Info')[0]||'',
      details: null,
      company: ((document.querySelector('.page-header h1')||{}).innerText||'').split('@')[1]||null,
      location: null,
      benefits: null
    }
  }
  function analyze (error, item) {
    if (error) return cbFn(error)
    console.log(item.description)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var urls = []
  var nodeList = (document.querySelectorAll('.table td a'))||[]
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var array = document.querySelectorAll('.next a')||[]
  var next = (array[array.length - 1]||{}).href
  return { urls, next } // same as `{ urls:urls, next:next }`
}
