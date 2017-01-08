var bulk = require('bulk-require')
var pages = bulk(__dirname, ['pages/**/*.js']).pages

var jobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))

execute(jobs)

function execute (jobs) {
	next(jobs.pop(), callback)
	function callback (data) { if (jobs.length) next(jobs.pop(), callback) }
}

function next (job, next) {
	job.fn({ show: true }, function callback (result) {
		console.log('-------')
		console.log(job.name, result)
	})
}
