/******************************************************************************
  https://www.bountysource.com/

  @TODO: scrape custom search instead of front page summary
******************************************************************************/
var nightmare = require('nightmare')

var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = execute

function execute (opts, done) {
  if (typeof done !== 'function') return
  opts = opts || { show: false }
  
  nightmare(opts)
  .goto(`http://${URL}`)
  .wait('.bounty-description')
  .evaluate(query)
  .end()
  .run(collect)

  function collect (error, DATA) {
    if (error) return done(error)
    done(null, { NAME, DATA })
  }

}



function query () {
  return [...document.querySelectorAll('tr')].filter(function (tr) {
    return ((tr.querySelector('.bounty-description')||{}).innerText||'').split(' ')[1] === 'posted'
  }).map(function (tr) {
    return {
      date: (tr.querySelector('.secondary-text span')||{}).innerText||null,
      skills: null,
      requirements: null,
      title: null,
      type: null, // job / freelance
      payment: null, // fixed / per hour
      duration: null,
      budget: (((tr.querySelectorAll('.bounty-description')[0]||{}).innerText||'').split('bounty')[0]||'').split('a')[1]||null,
      description: ((tr.querySelectorAll('.bounty-description')[0]||{}).innerText||'').split('bounty')[1]||'',
      details: null,
      company: ((tr.querySelector('.bounty-description')||{}).innerText||'').split(' ').shift()||null,
      location: null,
      benefits: null,
      url: location.href
    }
  })
}
