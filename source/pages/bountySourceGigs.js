var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  nightmare(opts||{})
    .goto('https://www.bountysource.com/')
    .wait(2000)
    .evaluate(filterPosts)
    .end()
    .then(sendData)
    .catch(function (error) {
      console.error('Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
    })

  function filterPosts () {
    var posts = []
    var nodeList = document.querySelectorAll('.bounty-description')
    nodeList.forEach(function (x){
      var post = x.innerText
      if (criteria(post)) {
        posts.push(post)
      }
    })
    return posts
    function criteria (post) {
      post = post.toLowerCase()
      if  (post && post.includes('posted a') && (
           post.includes('css') ||
           post.includes('npm') ||
           post.includes('javascript') ||
           post.includes('js') ||
           post.includes('front') ||
           post.includes('mobile')
      )
      ) { return true }
    }
  }

  function sendData (result) {
    console.log(result)
    request
      .post('https://scraping-a5a55.firebaseio.com/bountySourceGigs.json')
      .send({ description: result })
      .set('Accept', 'application/json')
      .end(function (err, res) {
      })
  }
}
