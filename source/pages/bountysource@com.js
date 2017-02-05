/******************************************************************************
  https://www.bountysource.com/

  @TODO: scrape custom search instead of front page summary
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
  .wait(2000)
  .evaluate(query)
  .end()
  .run(collect)


  function collect (error, result) {
    if (error) return done(error)
    var DATA = []
    var total = result.length
    console.log(total)
    result.forEach(x=>console.log(x.description))
    if (result.length) next(result.shift(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${result.length}/${total} - ${URL}`)
      if (result.length) return next(result.shift(), callback)
      done(null, { NAME, DATA })
    }
  }

}

function next (item, callback) {
  meta({ item, raw: item.description }, callback)
}

function query () {
  return [...document.querySelectorAll('tr')].filter(function (tr) {
    return ((tr.querySelector('.bounty-description')||{}).innerText||'').split(' ')[1] === 'posted'
  }).map(function (tr) {
    return {
      date: tr.querySelector('.secondary-text span').innerText,
      skills: null,
      requirements: null,
      title: null,
      type: null, // job / freelance
      payment: null, // fixed / per hour
      duration: null,
      budget: ((tr.querySelectorAll('.bounty-description')[0]||{}).innerText.split('bounty')[0]||'').split('a')[1],
      description: ((tr.querySelectorAll('.bounty-description')[0]||{}).innerText||'').split('bounty')[1],
      details: null,
      company: ((tr.querySelector('.bounty-description')||{}).innerText||'').split(' ').shift(),
      location: null,
      benefits: null
    }
  })
}
