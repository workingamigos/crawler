/******************************************************************************
  http://www.freelancermap.com/it-projects/javascript-189

  @TODO:
  ADD PAGINATION!!!
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
  nightmare(opts)
  .goto(`http://${URL}`)
  .wait('.title a')
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
  .evaluate(query)
  .end()
  .run(analyze)

  function query () {
    return {
      date: null,
      skills: (document.querySelector('#project .project-categories')||{}).innerText||'',
      requirements: null,
      title: (document.querySelector('#project .headline-lightblue')||{}).innerText||'',
      type: (document.querySelectorAll('#project .project-details .project-detail-description')[0]||{}).innerText||'',
      payment: null, // fixed / per hour
      duration: (document.querySelectorAll('#project .project-details .project-detail-description')[2]||{}).innerText||'',
      budget: null,
      description: ((document.querySelector('.projectcontent')||{}).innerText||'').split(" Apply now")[1]||'',
      details: null,
      company: null,
      location: (document.querySelectorAll('#project .project-details .project-detail-description')[4]||{}).innerText||'',
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
  var nodeList = document.querySelectorAll('.title a')
  ;(nodeList||[]).forEach(function (x) { urls.push(x.href) })
  var array = document.querySelectorAll('.next')||[]
  var next = (array[array.length - 1]||{}).href
  return { urls, next } // same as `{ urls:urls, next:next }`
}
