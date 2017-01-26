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

function next (text, callback) {
  meta({ item: {}, raw: text }, callback)
}

function query () {
  var posts = []
  var nodeList = document.querySelectorAll('.bounty-description')
  ;(nodeList||[]).forEach(function (x){
    var post = x.innerText||''
    if (post.toLowerCase().includes('posted a')) {
      posts.push(post)
    }
  })
  return posts
}
