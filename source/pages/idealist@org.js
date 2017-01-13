var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
  .goto('http://www.idealist.org/search/v2/?qs=QlpoOTFBWSZTWXh5xvkAAGMfgAMAcAIBAAAAuvf_oCAAlUJSap6n-pPST9TUGmmmmglE0mp5oghpp-omkY7pTTNqOlam62WWRfZJwcr4mMoR036kKVQJNtvx8KYyYIWrdu9WDqeXbPSbm5TNgUNCIJyxYaHnqUVRUlI2tyK8iw_WBt8rjXRdDCA7awK1FgT8M3SnJ60qKfdXvFSUbcvKexrc8fxdyRThQkHh5xvk')
  .evaluate(getUrls)
  .end()
  .then(scrapeUrls)

  function getUrls () {
    var nodeList = document.querySelectorAll('.assetName a')
    var urls = []
    nodeList.forEach(function (x) {
      urls.push(x.href)
    })
    return urls
  }

  function scrapeUrls (urls) {
    next(urls.pop(), callback)
    function callback (error, data) {
      if (error) return report(error)
      report(null, data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    nightmare()
    .goto(url)
    .wait('.listing-main')
    .evaluate(function (){
      var result = document.querySelector('.listing-main').innerText
      return result
    })
    .end()
    .run(cbFn)
  }

  function sendData (result) {
    request
      .post('https://scraping-a5a55.firebaseio.com/idealist@org.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
  }
}
