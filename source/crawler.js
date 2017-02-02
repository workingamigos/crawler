/******************************************************************************
  CRAWLER

  @TODO: RECEIVE MAIL:
    * http://www.emailyak.com/
    * http://www.mailgun.com/
    * https://postmarkapp.com/
    * https://sendgrid.com/
    * https://context.io/pricing

******************************************************************************/
var hyperquest = require('hyperquest')
var from2array = require('from2-array')
var lilpids = require('lilpids')
var through = require('through2')

var meta = require('_meta')
var selectBots = require('_selectbots-stream')
/*****************************************************************************/

var selectors$ = from2array.obj(process.argv.splice(2))
var selectBots$ = selectBots(`${__dirname}/bots`, '.js')
var makeCommands$ = makeCommands(scriptname => `electron ${scriptname} --debug`)
var start$ = lilpids()

selectors$
  .pipe(selectBots$)
  .pipe(makeCommands$)
  .pipe(start$, { end: false }).on('data', function (data) {
    console.log(data)
    // @TODO: get channel to bot to receive data updates for firebase
  })


function startAll (jobs) {
	if (!jobs.length) return console.log('no jobs found')
	console.log(`SCRAPING:\n---------\n${jobs.map(j=>'* '+j.name).join('\n')}\n`)
  crawl(jobs.pop(), next)
	function next () { if (jobs.length) crawl(jobs.pop(), next) }
}

function crawl (job, next) {
  var electron$ = job.bot({ debug: true })
  // electron$.on('data', function (data) {
  //   // console.log('[CRAWLER]', data)
  // })
  console.log(process.argv[0])
  // var spawn = require('child_process').spawn
  // var ls = spawn(process.argv[0], ['-lh', '/usr'])
  // ls.stdout.on('data', function (data) { console.log(`stdout: ${data}`) })
  // ls.stderr.on('data', function (data) { console.log(`stderr: ${data}`) })
  // ls.on('close', function (code) { console.log(`child process exited with code ${code}`) })
  console.log('before end')
  electron$.destroy()
  console.log('after end')
}

/******************************************************************************
HELPER
******************************************************************************/
function makeCommands (command) {
  var services = []
  return through.obj(function (scriptname, encoding, next) {
    services.push(command(scriptname))
    next()
  }, function (next) {
    this.push(services.slice())
    next()
  })
}

function httpRequests () { // @TODO: SEND DATA TO FIREBASE
  // var req1 = hyperquest.post('http://requestb.in/1b1my941').on('data', function (data) {
  //   console.log('indirect', data.toString())
  // })
  // req1.write('yo')
  // req1.write('yo')
  // req1.write('yo')
  // req1.end('yo')
  //
  // var req2 = hyperquest('http://requestb.in/1b1my941', { method: 'POST' }).on('data', function (data) {
  //   console.log('direct',data.toString())
  // })
  // req2.write('yo')
  // req2.write('yo')
  // req2.write('yo')
  // req2.end('yo')
}

// process.on('uncaughtException', function (err) {
//   console.error(err)
//   // @TODO: MAYBE SHUTDOWN BOTS?
//   process.exit(err)
// })
