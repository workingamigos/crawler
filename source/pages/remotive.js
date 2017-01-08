var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  // nightmare({ show: true })
  //   .goto('http://jobs.remotive.io/?category=engineering')
  opts || {}
  
  report('@TODO: scrape properly')
  function query () {
    var oldOpen = window.open
    function hookOpen (cb) {
      window.open = function (url) {
        cb(url)
        oldOpen.apply(window, arguments)
      }
      return function undo () { window.open = oldOpen }
    }
    return Array.from(document.querySelectorAll('li')).map((x,i)=> {
			var ss = Array.from(x.querySelectorAll('span span')).map(s => s.innerHTML)
      var link = 'link'
      var undo = hookOpen(url => { link = url })
      x.click()
      undo()
      return {
        link: link,
				title: ss[0],
				company: ss[2],
				type: ss[3],
				length: ss.length
			}
		}).filter(x=> x.length && ~x.type.toLowerCase().indexOf('remote')).map(x=>{
			x.type = 'remote'
			return x
		})
  }
}
