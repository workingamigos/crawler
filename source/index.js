// https://www.npmjs.com/package/firebase-event-stream
// https://www.npmjs.com/package/firebase-read-stream
var bulk = require('bulk-require')

var get = require('_get')

var pages = bulk(__dirname, ['pages/**/*.js']).pages
var alljobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))
var opts = { show : false }

startAll(getJobs(process.argv.splice(2)))

function getJobs (abbreviations) {
	if (abbreviations.length) return abbreviations.reduce((jobs, abbr) => {
		var name = get.name(abbr)
		return jobs.concat(alljobs.filter(j => ~j.name.indexOf(name)))
	},[])
	else return alljobs
}

function startAll (jobs) {
	console.log(jobs)
	execute(jobs.pop(), next)
	function next () { if (jobs.length) execute(jobs.pop(), next) }
}

function execute (job, next) {
	job.fn(opts, function report (error, result) {
		if (error) throw error
		console.log(`---------- FINISHED ${job.name} ----------`)
		next()
	})
}
