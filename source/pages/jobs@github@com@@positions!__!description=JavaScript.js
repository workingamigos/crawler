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
      .wait('.title a')
      .evaluate(query)
      .end()
      .run(nextPage)
    console.log("GOING TO COLLECT NOW")
    collect(error, allUrls)
  }

  function collect (error, urls) {
    console.log("URLS")
    console.log(urls)
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
  .wait('.main')
  .evaluate(query)
  .end()
  .run(cbFn)

  function query (){
    var text = document.querySelector('.main').innerText
    return text
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.title a')
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var next = (document.querySelector('.pagination a')||{}).href
  return { urls, next } // same as `{ urls:urls, next:next }`
}
