// https://www.npmjs.com/package/firebase-event-stream
// https://www.npmjs.com/package/firebase-read-stream
var bulk = require('bulk-require')

var pages = bulk(__dirname, ['pages/**/*.js']).pages
var jobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))

var urlFragment = process.argv[2].replace('/','_')

if (urlFragment) start(getJob(urlFragment))
else startAll(jobs)

function start (job) {
	var fn = require(`./pages/${job.name}`)
	var opts = { show : false }
	fn(opts, function (error, data) {
		if (error) throw error
		console.log(data)
	})
}

function getJob (urlFragment) {
	return jobs.reduce((job, j)=>{
		if (~j.name.indexOf(urlFragment)) job = j
		return job
	})
}

function startAll (jobs) {
	execute(jobs.pop(), next)
	function next () { if (jobs.length) execute(jobs.pop(), next) }
}

function execute (job, next) {
	job.fn({ show: false }, function callback (result) {
		console.log(`---------- FINISHED ${job.name} ----------`)
		next()
	})
}
