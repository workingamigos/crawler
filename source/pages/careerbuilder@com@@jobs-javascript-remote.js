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
  .run(nextPage)



  var allUrls = []

  function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
    if (error) return done(error)
    allUrls = allUrls.concat(data.urls)
    console.log(`collected urls: ${allUrls.length}`)
    var next = data.next
    console.log(next)
    if (next) return nightmare(opts)
      .goto(next)
      .wait('.job-title a')
      .evaluate(query)
      .end()
      .run(nextPage)
    console.log("GOING TO COLLECT NOW")
    collect(error, allUrls)
  }

  function collect (error, urls) {
    console.log("START COLLECTING")
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
  .wait('.card .item')
  .evaluate(query)
  .end()
  .run(analyze)

  function query (){
    return {
      date: (document.querySelector('.main #job-begin-date')||{}).innerText,
      skills: null,
      requirements: null,
      title: (document.querySelector('.main h1')||{}).innerText,
      type: (document.querySelectorAll('.job-facts .tag')[0]||{}).innerText,
      payment: null, // fixed / per hour
      duration: null,
      budget: [...document.querySelectorAll('.job-facts .tag')]
        .map(element => {
          if (element && element.innerText) {
            return element.innerText.includes('$') ? element.innerText : null
          }
          return null
        }),
      description: (document.querySelector('.main .description')||{}).innerText,
      details: null,
      company: ((document.querySelector('.main #job-company-name')||{}).innerText||'').split('•')[0],
      location: ((document.querySelector('.main #job-company-name')||{}).innerText||'').split('•')[1],
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
  var nodeList = document.querySelectorAll('.job-title a')
  ;(nodeList||[]).forEach(function (x) {
    urls.push(x.href)
  })
  var array = document.querySelectorAll('.pager a')||[]
  if (array[array.length - 1].getAttribute('aria-disabled') === 'false') {
    var next = (array[array.length - 1] === 'false'||{}).href
  }
  return { urls, next } // same as `{ urls:urls, next:next }`
}
