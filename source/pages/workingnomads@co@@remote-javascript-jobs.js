var nightmare = require('nightmare')

var meta = require('_meta')
var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = execute

function execute (opts, done) {
  if (typeof done !== 'function') return
  opts = opts || { show: false }
  console.log("STARTING TO EXECUTE")
  nightmare(opts)
  .goto(`http://${URL}`)
  .wait('.open-button.ng-binding')
  .evaluate(query)
  .end()
  .run(collect)


  function collect (error, urls) {
    console.log("STARTING TO COLLECT")
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    console.log("TOTAL IS " + total)
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      console.log(data)
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) return next(urls.pop(), callback)
      done(null, { NAME, DATA })
    }
  }
}

function next (url, cbFn) {
  nightmare()
  .goto(url)
  .evaluate(query)
  .end()
  .run(cbFn)

  function query () {
    return document.querySelector('.job-description').innerText||{}
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.open-button.ng-binding')
  nodeList.forEach(function (x) {
    urls.push(x.href)
  })
  return urls
}
