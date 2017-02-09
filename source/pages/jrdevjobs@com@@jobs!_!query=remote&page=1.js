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
  .wait('.container .row div .outer')
  .evaluate(query)
  .end()
  .run(analyze)

  function query () {
    return {
      date: (document.querySelector('.container .date')||{}).innerText||null,
      skills: (document.querySelectorAll('.container .job-badge-wrapper .badge')[2]||{}).innerText||null,
      requirements: (document.querySelectorAll('.container .job-badge-wrapper .badge')[3]||{}).innerText||null,
      title: (document.querySelector('.job-header .job-position')||{}).innerText||null,
      type: (document.querySelectorAll('.container .job-badge-wrapper .badge')[1]||{}).innerText||null,
      payment: null,
      duration: null,
      budget: null,
      description: (document.querySelector('.container .inner')||{}).innerText||'',
      details: null,
      company: (document.querySelector('.job-header .job-company')||{}).innerText||null,
      location: (document.querySelectorAll('.container .job-badge-wrapper .badge')[0]||{}).innerText||null,
      benefits: null,
      url: location.href
    }
  }
  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var urls = []
  var nodeList = document.querySelectorAll('.card-headline a')
  nodeList.forEach(function (x) {
    urls.push(x.href)
  })
  return urls
}
