var request = require('superagent');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

nightmare
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
  function criteria (title) {
    if  (title.includes('javascript') ||
         title.includes('Javascript') ||
         title.includes('js') ||
         title.includes('JS') ||
         title.includes('front') ||
         title.includes('Front') ||
         title.includes('mobile')
        ) { return true }
  }
}

function scrapeUrls (urls) {
  next(urls.pop(), callback)
  function callback (data) {
    sendData(data)
    if (urls.length) next(urls.pop(), callback)
  }
}

function next (url, cbFn) {
  Nightmare()
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
