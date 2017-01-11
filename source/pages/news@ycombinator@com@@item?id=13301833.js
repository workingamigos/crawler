var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
    .goto('https://news.ycombinator.com/item?id=13301833')
    .evaluate(filterPosts)
    .end()
    .then(scrapeJobs)
    .catch(function (error) {
      console.error('lalala4')
      console.error('Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
    })

  function filterPosts () {
    var list = []
    var nodeList = document.querySelectorAll('.default .comment')
    nodeList.forEach(function (x){
      var post = x.innerText
      if (criteria(post)) {
        list.push(post)
      }
    })
    return list
    function criteria (post) {
      post = post.toLowerCase()
      if (post.includes('SEEKING FREELANCERS - REMOTE') &&
          (post.includes('javascript') ||
           post.includes('Javascript') ||
           post.includes('js') ||
           post.includes('JS') ||
           post.includes('front') ||
           post.includes('Front') ||
           post.includes('mobile')
          )
        ) { return true }
    }
  }

  function scrapeJobs (list) {
    report(null, list)
    sendData(list)
  }

  function sendData (jobs) {
    jobs.forEach (function (job){
      request
      .post('https://scraping-a5a55.firebaseio.com/ycombinator_gigs.json')
      .send({ description: job })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        // Calling the end function will send the request
      })
    })
  }
}
