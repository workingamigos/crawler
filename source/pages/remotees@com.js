/******************************************************************************
  @TODO

******************************************************************************/
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
    //urls.pop deletes last element and returns it, this is then first argument in next(url,cbFn)
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
  function query () {
    var urls = []
    var nodeList = document.querySelectorAll('.position a')
    nodeList.forEach(function (x) {
      urls.push(x.href)
    })
    return urls
  }
}
function next (url, cbFn) {
  console.log("START NEXT")
  console.log(url)
  nightmare()
  .goto(url)
  .evaluate(query)
  .end()
  .run(cbFn)

  function query () {
    console.log("FIND TEXT")
    return (document.querySelector('.single-text')||{}).innerText
  }
  // function analyze (error, text) {
  //   console.log("START ANALYZING")
  //   if (error) return cbFn(error)
  //   meta({ item: {}, raw: text }, filter)
  // }
  // function filter (error, data) { // data = { item: {}, raw: text, meta: { pros: [], cons: [] } }
  //   if (error) return done(error)
  //   if (data.meta.cons.length) return cbFn()
  //   cbFn(null, data)
  // }
}
