/******************************************************************************
  https://news.ycombinator.com/item?id=13301833

  @TODO:
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
  .evaluate(query)
  .end()
  .run(collect)





  function collect (error, list) {
    if (error) return done(error)
    var DATA = []
    var total = list.length
    if (list.length) next(list.pop(), callback)
    function callback (error, data) {
      if (error) return done(error)
      if (data) DATA.push(data)
      console.log(`${list.length}/${total} - ${URL}`)
      if (list.length) next(list.pop(), callback)
      else done(null, { NAME, DATA })
    }
  }

}

function next (item, callback) {
  meta({ item: {}, raw: item }, callback)
}

function query () {
  var list = []
  var nodeList = document.querySelectorAll('.default .comment')
  nodeList.forEach(function (x){
    var post = x.innerText||''
    // if (post.includes('SEEKING FREELANCERS - REMOTE')) {
    if (post.includes('SEEKING FREELANCER')) {
      list.push(post)
    }
  })
  return list
}
