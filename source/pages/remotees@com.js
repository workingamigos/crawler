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
    .run(analyze)

  function query () {
    return {
      date: ((document.querySelector('.center .single-company')||{}).innerText||'').split(' · ')[1]||null,
      skills: null,
      requirements: null,
      title: (document.querySelector('.center h1')||{}).innerText||'',
      type: null,
      payment: null,
      duration: null,
      budget: null,
      description: (document.querySelector('.center .single-text')||{}).innerText||'',
      details: null,
      company: ((document.querySelector('.center .single-company')||{}).innerText||'').split(' · ')[0]||null,
      location: null,
      benefits: null
    }
  }

  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
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
