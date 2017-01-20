var nightmare = require('nightmare')

var meta = require('_meta')
var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = execute

function execute (opts, done) {
  console.log("STARTING NOW")
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
      .wait('.jobs li a')
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
  .wait('.job-details')
  .evaluate(query)
  .end()
  .run(cbFn)

  function query (){
    var p1 = document.querySelector('.job-title').innerText
    var p2 = document.querySelector('.job-details').innerText
    var text = p1 + '\n' + p2
    return text
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.jobs li a')
  ;(nodeList||[]).forEach(function (x) { urls.push(x.href) })
  var node = document.querySelector('.pagination span.next a')
  var next
  if (node) { next = node.href }
  else { next = {}.href }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
