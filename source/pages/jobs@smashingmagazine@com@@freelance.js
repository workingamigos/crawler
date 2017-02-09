/******************************************************************************
  http://jobs.smashingmagazine.com/freelance
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
  nightmare()
  .goto(item.url)
  .evaluate(query)
  .end()
  .run(analyze)

  function query (){
    return {
      date: (document.querySelector('.job-entry .date')||{}).innerText||'',
      skills: null,
      requirements: null,
      title: (document.querySelector('.job-entry h2')||{}).innerText||'',
      type: (document.querySelector('.job-entry .tags')||{}).innerText||'',
      payment: null,
      duration: null,
      budget: null,
      description: [...document.querySelectorAll('.job-entry p')].map(x => x.innerText||'').join('\n'),
      details: null,
      company: ((document.querySelector('.job-entry .author')||{}).innerText||'').split('(')[0]||null,
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
  var nodeList = document.querySelectorAll('.entry-list li a')
  nodeList.forEach(function (x) {
    var post = x.innerText
    var url = x.href
    urls.push({ post, url })
  })
  return urls
}
