var xray = require('x-ray')
var nightmareDriver = require('x-ray-nightmare')

module.exports = function nightmareXray (waitForSelector) {
	waitForSelector = waitForSelector || 'div'
	// instantiate driver for later shutdown
	var done = nightmareDriver(function init (ctx, nightmare) {
		// `waitForSelector` to appear in DOM before passing output to x-ray
		return nightmare.goto(ctx.url).wait(waitForSelector)
	})
  var x = xray().driver(done)
	// x(url, selector)(fn)
	// x(url, scope, selector)
	// x(html, scope, selector)
	return function nightmareX () {
		var _fn = x.apply(null, arguments)
		return function callback (fn) {
			_fn(dummy)
			function dummy (err, data) {
				fn(err, data, done)
			}
		}
	}
}
//------------------------------
// var nxray = require('./nxray')
//
// var xray = require('x-ray')
// // var x = nxray('.positions')
// var x = xray()
//
// var get = x('http://jobs.remotive.io/?category=engineering', 'body', [{
// 	item: ''
// }])
//
// get(function(err, data, done) {
//   if (err) return console.error(err)
//   console.log({data})
// 	// done()
// })
//------------------------------
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
