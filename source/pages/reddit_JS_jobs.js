var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
    .goto('https://www.reddit.com/r/javascript_jobs/')
    .evaluate(getUrls)
    .end()
    .then(scrapeUrls)

  function getUrls () {
    var nodeList = document.querySelectorAll('.thing .entry .title a')
    var urls = []
    nodeList.forEach(function (x) {
      urls.push(x.href)
    })
    urls = urls.reduce(function(total, currentVal, currentIndex, arr) {
      if (currentVal.length > 41) { total.push(currentVal) } // "https://www.reddit.com/r/javascript_jobs/".length
      return total
    }, [])
    return urls
  }

  function scrapeUrls (urls) {
    next(urls.pop(), callback)
    //urls.pop deletes last element and returns it, this is then first argument in next(url,cbFn)
    function callback (data) {
      report(data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    nightmare()
    .goto(url)
    .wait('.thing .entry .expando .usertext .usertext-body .md')
    //.wait(500)
    .evaluate(function (){
      var result = document.querySelector('.thing .entry .expando .usertext .usertext-body .md').innerText
      return result
    })
    .end()
    .then(function (result) { cbFn(result) })
    .catch(function (error) {
      console.error('Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
    })
  }

  function sendData (result) {
    request
      .post('https://scraping-a5a55.firebaseio.com/reddit_JS_jobs.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
  }
}
