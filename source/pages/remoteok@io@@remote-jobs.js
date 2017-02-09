/******************************************************************************
  https://remoteok.io/remote-jobs

  @TODO:
  https://remoteok.io/remote-web-dev-jobs
  https://news.ycombinator.com/jobs
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
  .wait('.company_and_position a')
  .evaluate(query)
  .end()
  .run(collect)

  function collect (error, result) {
    if (error) return done(error)
    var DATA = []
    var total = result.length
    if (result.length) next(result.pop(), callback)
    function callback (error, data) {
      if (typeof error === 'string') error = JSON.parse(error)
      if (error && error.details != 'ERR_INTERNET_DISCONNECTED') return done(error)
      if (data) DATA.push(data)
      console.log(`${result.length}/${total} - ${URL}`)
      if (result.length) next(result.pop(), callback)
      else done(null, { NAME, DATA })
    }
  }

}

function next (data, cbFn) {
  if (data) return nightmare()
    .goto(data.url)
    .evaluate(query)
    .end()
    .run(analyze)

  function query () {
    return {
      date: null,
      skills: (document.querySelector('.tags')||{}).innerText||'',
      requirements: null,
      title: ((document.querySelector('.company_and_position')||{}).innerText||'').split('\n')[0]||null,
      type: null,
      payment: null,
      duration: null,
      budget: null,
      description: (document.querySelector('.description p')||{}).innerText||'',
      details: null,
      company: ((document.querySelector('.company_and_position')||{}).innerText||'').split('\n')[1]||null,
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
  var nodeList = document.querySelectorAll('.company_and_position a')
  nodeList.forEach(function (x){
    var title = x.innerText
    var url = x.href
    urls.push({ url, title })
  })
  return urls
}
