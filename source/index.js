var nxray = require('./nxray')

var x = nxray('[class^=app]')

var get = x('http://app.wizardamigos.com/public/browser', 'body', [{
	content: ''
}])

get(function(err, data, done) {
  if (err) return console.error(err)
  console.log({data})
	done()
})


// var nightmare = require('nightmare')
// var nm = nightmare({ show: false })
//
// nm
//   .goto('http://app.wizardamigos.com/public/browser')
//   .wait('div')
//   .evaluate(function () {
//     return document.querySelector('body').innerHTML
//   })
//   .end()
//   .then(function (html) {
//     console.log(result)
//   })
//   .catch(function (error) {
//     console.error('Search failed:', error)
//   })



// var xray = require('x-ray')
// var x = xray()
//
// var baseUrl = 'http://www.kickstarter.com'
//
// function getProjects (type, cb) {
// 	type = type || 'popularity'
//   var url = baseUrl + '/discover/advanced?sort=' + type
//   var get = x(url, '.project', [{
//     data: '.project-card @data-project',
//     title: '.project-title',
//     image: '.project-thumbnail img@src',
//     link: '.project-thumbnail a@href',
//     blurb: '.project-blurb'
//   }])//.paginate('#pnnext@href').limit(5)
//   get(cb)
// }
// function getSearchResults (searchurl, cb) {
//   var get = x(searchurl, '.g', [{
//     link: 'a@href',
//     a: '', // grab the innerHTML
//     details: x('a@href', {
//       title: 'title',
//       link: 'a@href',
//       linkText: 'a@text'
//     })
//   }]).paginate('#pnnext@href').limit(5)
//   get(cb)
// }
//
// var url = "https://www.google.ca/search?site=&source=hp&q=spice+and+wolf&oq=spice+and+wolf"
// getSearchResults (url, function (err, results) {
//   if (err) return console.error(err)
//   console.log({results})
// })
// // getProjects(null, function(err, projects) {
// //   if (err) return console.error(err)
// //   console.log({projects})
// // })
