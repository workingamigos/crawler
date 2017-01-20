/******************************************************************************
  http://www.freelancermap.com/it-projects/javascript-189

  @TODO:
  http://www.freelancermap.com/index.php?module=projekt&func=suchergebnisse&pq=javascript&profisuche=0&pq_sorttype=1&area=newpb&redirect=1
  http://www.freelancermap.com/
  https://twitter.com/freelancer_INT
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
  opts.show = true
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
      .wait('.title a')
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
  .wait('.projectcontent')
  .evaluate(query)
  .end()
  .run(cbFn)

  function query (){
    return document.querySelector('#project').innerText
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.title a')
  ;(nodeList||[]).forEach(function (x) { urls.push(x.href) })
  var array = document.querySelectorAll('.next')||[]
  var next = (array[array.length - 1]||{}).href
  return { urls, next } // same as `{ urls:urls, next:next }`
}
