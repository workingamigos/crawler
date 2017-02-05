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
    if (urls.length) next(urls.shift(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${urls.length}/${total} - ${URL}`)
      if (urls.length) return next(urls.shift(), callback)
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
      return {
        date: (document.querySelector('#the_listing .description #posted')||{}).innerText||null,
        skills: null,
        requirements: null,
        title: (document.querySelector('.row-content .column h1')||{}).innerText||null,
        type: (document.querySelectorAll('.details li')[0]||{}).innerText||null,
        payment: null, // fixed / per hour
        duration: null,
        budget: null,
        description: [...(document.querySelectorAll('#the_listing .description p')||{})]
          .map(element => {
            if (element && element.innerText) return element.innerText
            return null
          }).join('\n'),
        details: (document.querySelector('#the_listing .description')||{}).innerText||null,
        company: (document.querySelector('#the_company .headings h1')||{}).innerText||null,
        location: (document.querySelectorAll('.details li')[1]||{}).innerText||null,
        benefits: null,
        application: (document.querySelector('#the_company #company_extras #company_links a')||{}).href||null
      }
    }

    function analyze (error, item) {
      if (error) return cbFn(error)
      meta({ item, raw: item.description }, cbFn)
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
