/******************************************************************************
  http://www.idealist.org/search/v2

  @TODO:
  https://www.cwjobs.co.uk/jobs/javascript
******************************************************************************/
var nightmare = require('nightmare')

var meta = require('_meta')
var get = require('_get')

// @TODO: TRY with ELECTRON
var querystring = '?qs=QlpoOTFBWSZTWcl2SH0AAGSfgAMAcAIBAAAAvvf_oCAAlQSVNGh6RiAGgCUFMJk0NQaPRNMW7jHazxok5ntc1aBW5dYYOVnkOoY6eH1SSA3rc08bocyCELJ7qLnoJXa1qWGhQqmgeMr80xafEh8U3ukhUZjxTkWrGZTqw_EKksqouxogNvuQksNiLdIjr2edNYEn4yadFyNYnx-3gsT1mX_i7kinChIZLskPoA=='
var URL = get.url(__filename) + querystring // (= javascript + remote + jobs)
var NAME = get.name(URL)
console.log(URL)
module.exports = execute

function execute (opts, done) {
  if (typeof done !== 'function') return
  opts = opts || { show: false }
  opts.show = true
  nightmare(opts)
  .goto(`https://${URL}`)

  // .insert('input[name="search_user_query"]', 'javascript')
  // .click('#searchButton')
  // .wait('#contentHeader[style="opacity: 1;"]')

  // .evaluate(function setup () {
  //   setTimeout(function () {
  //     console.log('m3h')
  //   },5000)
    // document.querySelector('input[value="job"]').checked = true
    // document.querySelector('input[value="only"]').checked = true
  // })
  // .wait('input[value=job][checked]')
  // .evaluate(function setup () {
    // document.querySelector('input[value="only"]').checked = true
  // })
  // .wait('#contentHeader[style="opacity: 1;"]')
  // .check('input[value=job]')
  // .check('input[value=only]')
  // .wait('input[value=job][only]')
  // .evaluate(function setup () {
  //   document.querySelector('input[name="search_user_query"]').value = 'javascript'
  //   document.querySelector('#searchButton').click()
  // })
  .evaluate(query)
  .end()
  .run(collect)

  function query () {
    var nodeList = document.querySelectorAll('.assetName a')
    var urls = []
    nodeList.forEach(function (x) { urls.push(x.href) })
    return urls
  }

  function collect (error, urls) {
    // document.querySelector('#searchButton').click()
    console.log('urls: ',{urls})
    next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      done(null, data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    nightmare()
    .goto(url)
    .wait('.listing-main')
    .evaluate(function (){
      return document.querySelector('.listing-main').innerText
    })
    .end()
    .run(cbFn)
  }

}
