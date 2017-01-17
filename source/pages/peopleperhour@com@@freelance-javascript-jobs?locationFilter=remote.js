/*
ERROR!!!
IN THE NEXT FUNCTION
{ message: 'navigation error',
  code: -3,
  details: '',
  url: 'https://fsafoodcareers-fsafood.icims.com/jobs/4669/web-developer---remote/job?in_iframe=1&mode=job&iis=Indeed&iisn=Indeed.com' }
*/

// var nightmare = require('nightmare')
//
// var meta = require('_meta')
// var get = require('_get')
//
// var URL = get.url(__filename)
// var NAME = get.name(URL)
//
// module.exports = execute
//
// function execute (opts, done) {
//   if (typeof done !== 'function') return
//   opts = opts || { show: false }
//   nightmare(opts)
//   .goto(`http://${URL}`)
//   .wait('.clearfix')
//   .evaluate(query)
//   .end()
//   .run(nextPage)
//
//   var allUrls = []
//
//   function nextPage (error, data) { //because of .run, we need 2 arguments: err & result
//     if (error) return done(error)
//     allUrls = allUrls.concat(data.urls)
//     console.log(`collected urls: ${allUrls.length}`)
//     var next = data.next
//     console.log(next)
//     if (next) return nightmare(opts)
//       .goto(next)
//       .wait('.title a')
//       .evaluate(query)
//       .end()
//       .run(nextPage)
//     console.log("GOING TO COLLECT NOW")
//     collect(error, allUrls)
//   }
//
//   function collect (error, urls) {
//     console.log("START COLLECTING")
//     if (error) return done(error)
//     var DATA = []
//     var total = urls.length
//     if (urls.length) next(urls.pop(), callback)
//     function callback (error, data) {
//       if (error) return done(error)
//       if (data) DATA.push(data)
//       console.log(`${urls.length}/${total} - ${URL}`)
//       if (urls.length) next(urls.pop(), callback)
//       else {
//         console.log("I'M DONE")
//         done(null, { NAME, DATA })
//       }
//     }
//   }
//
// }
//
// function next (url, cbFn) {
//   nightmare()
//   .goto(url)
//   .wait('.clearfix')
//   .evaluate(query)
//   .end()
//   .run(cbFn)
//
//   function query (){
//     var text = document.querySelector('.job-details .clearfix').innerText
//     return text
//   }
// }
//
// function query () {
//   var urls = []
//   var nodeList = document.querySelectorAll('.title a')
//   ;(nodeList||[]).forEach(function (x) {
//     urls.push(x.href)
//   })
//   var array = document.querySelectorAll('.yiiPager a')||[]
//   var next
//   if (array[array.length - 1].getAttribute('class') === 'next') {
//     next = (array[array.length - 1]).href
//   } else {
//     next = {}.href
//   }
//   return { urls, next } // same as `{ urls:urls, next:next }`
// }
