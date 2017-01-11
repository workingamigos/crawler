var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
  .goto('https://remoteok.io/remote-jobs')
  .evaluate(filterPosts)
  .end()
  .then(scrapeUrls)

  function filterPosts () {
    var urls = []
    var nodeList = document.querySelectorAll('.company_and_position a')
    nodeList.forEach(function (x){
      var title = x.innerText
      var url = x.href
      if (criteria(title)) {
        urls.push(url)
      }
    })
    return urls
    function criteria (post) {
      post = post.toLowerCase()
      if  (post && (
           post.includes('css') ||
           post.includes('npm') ||
           post.includes('javascript') ||
           post.includes('js') ||
           post.includes('front') ||
           post.includes('mobile')
         )) { return true }
    }
  }

  function scrapeUrls (urls) {
    next(urls.pop(), callback)
    function callback (data) {
      report(null, data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    nightmare()
      .goto(url)
      .wait('#jobsboard')
      .evaluate(function (){
        var result = document.querySelector('#jobsboard').innerText
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
      .post('https://scraping-a5a55.firebaseio.com/remoteok_jobs.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
  }
}
