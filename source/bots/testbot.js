var ewss = require('electron-websocket-stream')

module.exports = bot


function bot (options) {
  return ewss(function electronFn (BrowserifyWindow) {
    var opts = { width: 1000, height: 600 }
    opts.show = true
    var win = BrowserifyWindow(opts)
    win.loadURL('http://google.de')
    win.openDevTools()
  })
}
