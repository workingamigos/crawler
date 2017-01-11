var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
  .goto('http://frontenddeveloperjob.com/')
  .evaluate(getUrls)
  .end()
  .then(scrapeUrls)

  function getUrls () {
    var nodeList = document.querySelectorAll('.title a')
    var urls = []
    nodeList.forEach(function (x) {
      urls.push(x.href)
    })
    return urls
  }

  function scrapeUrls (urls) {
    next(urls.pop(), callback)
    function callback (data) {
      report(data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    nightmare()
    .goto(url)
    .wait('main .inner')
    .evaluate(function (){
      var result = document.querySelector('main .inner').innerText
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
      .post('https://scraping-a5a55.firebaseio.com/frontendDeveloperJobs.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
  }
}
