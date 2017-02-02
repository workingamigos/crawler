var electrows = require('electron-websocket-stream')

var argv = require('subarg')(process.argv.slice(2))

if (require.main === module) testbotproc(argv)

module.exports = testbotproc

function browser (ws) {
  // ws.write(document.title)
  // ws.end()
  console.log('YAY')
  window.ws = ws
  ws.write('GREAT')
  ws.end(document.title)
}

function testbotproc (options) {

  // communication to outside world :-)
  // process.stdout.write('\nblerg\n\n')
  // process.stderr.write('errrrrrr')
  // process.stdin.on('data', function (data) { console.log('tbp',data) })

  // @TODO: define notifications or command messages/actions to interact
  //        with the process

  electrows(options, function (error, electron) {
    var BrowserifyWindow = electron.BrowserifyWindow
    var app = electron.app // app is already 'ready'

    var opts = { width: 1000, height: 600 }
    opts.show = true

    console.log('STARTING')
    var win = BrowserifyWindow(opts)
    win.loadURL('http://google.de')
    win.openDevTools()
    var ws = win.webContents.connectFunctionScript(browser)

    console.log('STARTED')
    ws.on('data', function (data) {
      console.log(data)
    })
  })

}
