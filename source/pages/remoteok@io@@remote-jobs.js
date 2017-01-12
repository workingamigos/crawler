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





  function collect (error, result) {
    if (error) return done(error)
    var DATA = []
    var total = result.length
    if (result.length) next(result.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${result.length}/${total} - ${URL}`)
      if (result.length) next(result.pop(), callback)
      else done(null, { NAME, DATA })
    }
  }

}

function next (item, cbFn) {
  meta({ raw: item.title}, function (error, data) {
    if (data) return nightmare()
      .goto(item.url)
      .wait('#jobsboard')
      .evaluate(query)
      .end()
      .run(collect)
    cbFn(null, null)
  })
  function query () {
    return document.querySelector('#jobsboard').innerText
  }
  function collect (error, result) {
    if (error) return done(error)
    meta({ item, raw: result }, cbFn)
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.company_and_position a')
  nodeList.forEach(function (x){
    var title = x.innerText
    var url = x.href
    urls.push({ url, title })
  })
  return urls
}
