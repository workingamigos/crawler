/******************************************************************************
  http://frontenddeveloperjob.com/

  @TODO:
  https://twitter.com/frontenddevjob
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

  function query (){
    return {
      date: ((document.querySelector('.minihead ')||{}).innerText||'').split("— ")[1]||null,
      skills: null,
      requirements: null,
      title: (document.querySelector('.inner #job_title ')||{}).innerText||'',
      type: (document.querySelector('.inner #job_type ')||{}).innerText||'',
      payment: null,
      duration: null,
      budget: null,
      description: (document.querySelector('#job_body')||{}).innerText||'',
      details: null,
      company: (document.querySelector('.inner #job_employer_name ')||{}).innerText||'',
      location: (document.querySelector('.inner #job_location ')||{}).innerText||'',
      benefits: null
    }
  }

  function analyze (error, item) {
    if (error) return cbFn(error)
    meta({ item, raw: item.description }, cbFn)
  }
}

function query () {
  var nodeList = document.querySelectorAll('.title a')
  var urls = []
  nodeList.forEach(function (x) { urls.push(x.href) })
  return urls
}
