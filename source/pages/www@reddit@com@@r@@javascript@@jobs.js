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
    console.log(urls)
    console.log(urls.length)
    if (error) return done(error)
    var DATA = []
    var total = urls.length
    //urls.pop deletes last element and returns it, this is then first argument in next(url,cbFn)
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
  nightmare()
  .goto(url)
  .wait('.thing .entry .expando .usertext .usertext-body .md')
  //.wait(500)
  .evaluate(query)
  .end()
  .run(cbFn)

  function query () {
    return document.querySelector('.thing .entry .expando .usertext .usertext-body .md').innerText
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.thing .entry .title a')
  nodeList.forEach(function (x) {
    urls.push(x.href)
  })
  urls = urls.reduce(function(total, currentVal, currentIndex, arr) {
    // "https://www.reddit.com/r/javascript_jobs/".length
    if (currentVal.length > 41) { total.push(currentVal) }
    return total
  }, [])
  return urls
}
