var request = require('superagent');
var Xray = require('x-ray');
var x = Xray();
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

nightmare
  .goto('https://news.ycombinator.com/item?id=13301833')
  .evaluate(filterPosts)
  .end()
  .then(scrapeJobs)
  .catch(function (error) {
    console.error('Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
  })

function filterPosts () {
  var list = []
  console.log("sdfasdf")
  var nodeList = document.querySelectorAll('.default .comment')
  nodeList.forEach(function (x){
    var post = x.innerText
    console.log("start criteria")
    if (criteria(post)) {
      list.push(post)
    }
  })
  return list
  function criteria (post) {
    //console.log("start criteria")
    if (post.includes('SEEKING FREELANCERS - REMOTE') &&
        (post.includes('javascript') ||
         post.includes('js')
        )
      ) { return true }
  }
}

function scrapeJobs (list) {
  console.log("asfg")
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
