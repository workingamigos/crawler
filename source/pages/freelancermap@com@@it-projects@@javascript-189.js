var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, logging) {
  opts = opts || { show: false }
  var allUrls = []
  //opts.show = true
  nightmare(opts)
    .goto('http://www.freelancermap.com/it-projects/javascript-189')
    .evaluate(getUrls)
    .end()
    .run(nextPage)

  function getUrls () {
    var urls = []
    var nodeList = document.querySelectorAll('.title a')
    ;(nodeList||[]).forEach(function (x) {
      urls.push(x.href)
    })
    var array = document.querySelectorAll('.next')||[]
    var next = (array[array.length - 1]||{}).href
    return {
      urls, //same as urls:urls, next:next
      next
    }
  }

  function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
    if (error) throw error
    allUrls = allUrls.concat(data.urls)
    var next = data.next
    if (next) {
      nightmare(opts)
        .goto(next)
        .wait('.title a')
        .evaluate(getUrls)
        .end()
        .run(nextPage)
    }
    else scrapeUrls(allUrls)
  }

  function scrapeUrls (urls) {
    console.log(urls)
    next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return logging(error)
      logging(null, data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    console.log(url)
    nightmare(opts)
      .goto(url)
      .wait('.projectcontent')
      .evaluate(function (){
        var result = document.querySelector('#project').innerText
        return result
      })
      .end()
      .run(cbFn)
  }

  function sendData (result) {
    request
      .post('https://scraping-a5a55.firebaseio.com/freelancermap.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
  }
}
