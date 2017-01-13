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
  .useragent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
  .goto(`http://${URL}`)
  .wait('#sidebar > ul > li:first-child a')
  .click('#sidebar > ul > li:first-child a')
  .wait('#content > ul > li')
  .end()
  .evaluate(query)
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

function next (item, callback) {
  meta({ item, raw: item.text }, cb)
  function cb (error, data) {
    if (error) return done(error)
    if (data && data.raw) data.raw.pop()
    callback(error, data)
  }
}

function query () {
  return Array
  .from(document.querySelectorAll('#content > ul > li'))
  .filter(x => {
    var body = x.querySelector('.body')
    if (body) return body.innerText.includes('SEEKING FREELANCER')
  })
  .map(x => {
    var link = x.querySelector('.link a')
    if (link) link = link.getAttribute('href')
    var text = x.querySelector('.body')
    if (text) text = text.innerText
    return { text, link }
  })
}
