/******************************************************************************
  http://jobs.remotive.io/?category=engineering

  @TODO:
  https://twitter.com/remotiveio
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

  nightmare(opts).goto(`http://${URL}`)
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
      if (result.length) return next(result.pop(), callback)
      done(null, { NAME, DATA })
    }
  }

}

function next (item, cbFn) {
  nightmare()
  .goto(item.link)
  .evaluate(query)
  .end()
  .run(analyze)
  function query () {
    return {
      date: null,
      skills: null,
      requirements: null,
      title: null,
      type: null,
      payment: null,
      duration: null,
      budget: null,
      description: ((document.body||{}).innerText||'').toLowerCase()||'',
      details: null,
      company: null,
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
  var oldOpen = window.open
  function hookOpen (cb) {
    window.open = function (url) {
      cb(url)
      oldOpen.apply(window, arguments)
    }
    return function undo () { window.open = oldOpen }
  }
  return Array.from(document.querySelectorAll('li')).map((x,i)=> {
    var ss = Array.from(x.querySelectorAll('span span')).map(s => s.innerHTML)
    var link = 'link'
    var undo = hookOpen(url => { link = url })
    x.click()
    undo()
    return {
      link: link,
      title: ss[0],
      company: ss[2],
      type: ss[3],
      length: ss.length
    }
  }).filter(x=> x.length && x.type.toLowerCase().includes('remote')).map(x=>{
    x.type = 'remote'
    delete x.length
    return x
  })
}
