var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
  .goto('http://jobs.smashingmagazine.com/freelance')
  .evaluate(filterPosts)
  .end()
  .then(scrapeJobs)

  function filterPosts () {
    var urls = []
    var nodeList = document.querySelectorAll('.entry-list li a')
    nodeList.forEach(function (x){
      var post = x.innerText
      var url = x.href
      if (criteria(post)) {
        urls.push(url)
      }
    })
    return urls
    function criteria (post) {
      if  (post && true
        //   (post.includes('javascript') ||
        //    post.includes('Javascript') ||
        //    post.includes('js') ||
        //    post.includes('JS') ||
        //    post.includes('front') ||
        //    post.includes('Front') ||
        //    post.includes('mobile')
        //  )
      ) { return true }
    }
  }

  function scrapeJobs (urls) {
    next(urls.pop(), callback)
    function callback (data) {
      report(data)
      sendData(data)
      if (urls.length) next(urls.pop(), callback)
    }
  }

  function next (url, cbFn) {
    Nightmare()
      .goto(url)
      .wait('.job-entry')
      .evaluate(function (){
        var result = document.querySelector('.job-entry').innerText
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
      .post('https://scraping-a5a55.firebaseio.com/smashingMagazine.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
      })
  }
}
