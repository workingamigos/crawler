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
    .wait('.open-button.ng-binding')
    .evaluate(query)
    .end()
    .run(collect)

  function collect (error, urls) {
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) return next(urls.pop(), callback)
      done(null, { NAME, DATA })
    }
  }
}

function next (url, cbFn) {
  console.log(url)
  nightmare()
    .goto(url)
    .wait('.job-description')
    .evaluate(query)
    .end()
    .run(analyze)

  function query () {
    var text = (document.querySelector('.job-description')||{}).innerText
    return text
  }
  function analyze (error, text) {
    console.log(text)
    if (error) return cbFn(error)
    meta({ item: {}, raw: text }, cbFn)
  }
}

function query () {
  var urls = []
  var nodeList = (document.querySelectorAll('.open-button.ng-binding'))||[]
  nodeList.forEach(function (x) {
    urls.push(x.href)
  })
  return urls
}
