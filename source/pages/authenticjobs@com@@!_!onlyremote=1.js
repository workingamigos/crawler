var nightmare = require('nightmare')

var meta = require('_meta')
var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = execute

function execute (opts, done) {
  if (typeof done !== 'function') return
  opts = opts || { show: false }
  console.log("START")
  nightmare(opts)
  .goto(`http://${URL}`)
  .click('#more a')
  .evaluate(query)
  .end()
  .run(collect)

  function collect (error, urls) {
    if (error) return done(error)
    var total = urls.length
    var DATA = []
    if (urls.length) next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) return next(urls.pop(), callback)
      done(null, { NAME, DATA })
    }
  }

  function next (url, cbFn) {
    nightmare()
    .goto(url)
    .evaluate(query)
    .end()
    .run(analyze)

    function query () {
      return (document.querySelector('#content')||{}).innerText
    }

    function analyze (error, text) {
      if (error) return cbFn(error)
      meta({ item: {}, raw: text }, cbFn)
    }
  }

}

  function query () {
    var urls = []
    var nodeList = document.querySelectorAll('#listings li a')
    ;(nodeList||[]).forEach(function (x) {
      urls.push(x.href)
    })
    return urls
  }
