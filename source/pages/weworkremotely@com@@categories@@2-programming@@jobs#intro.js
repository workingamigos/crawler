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
  .run(collect)


  function collect (error, urls) {
    if (error) return done(error)
    var DATA = []
    var total = urls.length
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
    var p1 = (document.querySelector('.listing-header').innerText)||{}
    var p2 = (document.querySelector('.job').innerText)||{}
    var text = p1 + '\n' + p2
    return text
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.feature a')
  nodeList.forEach(function (x) {
    urls.push(x.href)
  })
  return urls
}
