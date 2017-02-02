/******************************************************************************
  https://www.bountysource.com/
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
  meta({ item, raw: item.description }, callback)
}

function query () {
  return {
    date: [...document.querySelectorAll('.secondary-text')]
      .map(element => {
        if (element && element.innerText) {
          var arr = element.innerText.split(' ')
          if (arr.includes('Featured')) arr.pop()
          while (arr.length > 3) { arr.shift() }
          return arr.join(' ')
        }
        return null
      }),
    skills: null,
    requirements: null,
    title: null,
    type: null, // job / freelance
    payment: null, // fixed / per hour
    duration: null,
    budget: ((document.querySelectorAll('.bounty-description')[0]||{}).innerText.split('bounty')[0]||'').split('a')[1],
    description: ((document.querySelectorAll('.bounty-description')[0]||{}).innerText||'').split('bounty')[1],
    details: null,
    company: [...document.querySelectorAll('.bounty-description')]
      .map(element => {
        if (element && element.innerText) {
          var arr = element.innerText.split(' ')
          arr.shift()
          return arr.join('')
        }
      }),
    location: null,
    benefits: null
  }
}
