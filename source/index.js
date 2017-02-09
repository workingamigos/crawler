var bulk = require('bulk-require')
var get = require('_get')
var meta = require('_meta')
var send = require('_send')
var spec = require('_specification')

var pages = bulk(__dirname, ['pages/**/*.js']).pages
var alljobs = Object.keys(pages).map(name => ({ fn: pages[name], name: name }))
var opts = { show : false }
var errmsg = 'Search failed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:'

startAll(getJobs(process.argv.splice(2)))

function getJobs (abbreviations) {
	if (abbreviations.length) return abbreviations.reduce((jobs, abbr) => {
		var name = get.name(abbr)
		return jobs.concat(alljobs.filter(j => j.name.includes(name)))
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
		var total = data.length
		var DATA = []

	  if (data.length) nextItem(data.shift(), callback)

	  function callback (error, d) {
	    if (error) throw error
	    if (d) DATA.push(d)
	    console.log(`${data.length}/${total} - ${job.name}`)
	    if (data.length) return nextItem(data.shift(), callback)
			else {
				result.DATA = DATA
				finish()
			}
	  }
	  function nextItem (item, callback) {
	    meta({ item, raw: item.description }, function (error, data) {
				if (error) console.error(errmsg, error, error.stack)
				if (data) return spec(data, callback)
				else callback()
			})
	  }

		function finish () {
			var name = result.NAME
			var data = result.DATA
			console.log('[SENDING DATA]')
			if (name && data) send(name, data, function (err, res) {
				if (err) return console.error(errmsg, err, err.stack)
				console.log(`----------`)
				console.log(`[${res.status}] ${get.url(name)}`)
				console.log('=> '+res.text)
				console.log(`----------`)
				next()
			})
		}

	}
}
