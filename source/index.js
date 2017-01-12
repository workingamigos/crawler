var bulk = require('bulk-require')
var get = require('_get')
var send = require('_send')

var pages = bulk(__dirname, ['pages/**/*.js']).pages
var alljobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))
var opts = { show : false }
var errmsg = 'Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:'

startAll(getJobs(process.argv.splice(2)))

function getJobs (abbreviations) {
	if (abbreviations.length) return abbreviations.reduce((jobs, abbr) => {
		var name = get.name(abbr)
		return jobs.concat(alljobs.filter(j => ~j.name.indexOf(name)))
	},[]).filter(function(item, index, inputArray) {
    return inputArray.indexOf(item) === index
  })
	else return alljobs
}

function startAll (jobs) {
	if (!jobs.length) return console.log('no jobs found')
	console.log(`SCRAPING:\n---------\n${jobs.map(j=>'* '+get.url(j.name)).join('\n')}\n`)
	execute(jobs.pop(), next)
	function next () { if (jobs.length) execute(jobs.pop(), next) }
}

function execute (job, next) {
	job.fn(opts, callback)
	function callback (error, result) {
		if (error) return console.error(error)
		var data = result.DATA
		var name = result.NAME
		send(name, data, function (err, res) {
			if (err) return console.error(errmsg,err)
			console.log(`----------`)
			console.log(`[${res.status}] ${get.url(name)}`)
			console.log('=> '+res.text)
			console.log(`----------`)
			next()
		})
	}
}
