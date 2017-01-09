// https://www.npmjs.com/package/firebase-event-stream
// https://www.npmjs.com/package/firebase-read-stream
// var bulk = require('bulk-require')
//
// var pages = bulk(__dirname, ['pages/**/*.js']).pages
// var jobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))
//
// execute(jobs)
//
// function execute (jobs) {
// 	process(jobs.pop(), next)
// 	function next () { if (jobs.length) process(jobs.pop(), next) }
// }
//
// function process (job, next) {
// 	job.fn({ show: false }, function callback (result) {
// 		console.log(`---------- FINISHED ${job.name} ----------`)
// 		next()
// 	})
// }


var fn = require('./pages/remotive')
var opts = { show : false }
fn(opts, function (data) {
	console.log(data)
})
