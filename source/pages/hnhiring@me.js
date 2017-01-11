var nightmare = require('nightmare')

var send = require('_send')
var meta = require('_meta')
var get = require('_get')

var URL = get.url(__filename)
var NAME = get.name(URL)

module.exports = function execute (opts, report) {
  opts = opts || { show: false }
  var nm = nightmare(opts)

  nm.useragent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
    .goto('http://'+url)
    .click('#sidebar > ul > li:first-child a')
    .wait('#content > ul > li')
    .end()
    .evaluate(query)
    .run(collect)

    function collect (error, result) {
      if (error) return console.log(error)
      var counter = result.length
      var DATA = []
      result.forEach(function (data) {
        meta(data.text, function (err, info) {
          if (err) throw err
          data.text = info.text
          data.text.pop()
          data.stack = {
            tech: info.tech,
            antitech: info.antitech
          }
          if (--counter) DATA.push(data)
          else send(NAME, data, report)
        })
      })


    }
    function query () {
      var arr = Array
        .from(document.querySelectorAll('#content > ul > .comment'))
        .filter(x => {
          var body = x.querySelector('.body')
          if (body) return ~body.innerText.indexOf('SEEKING FREELANCER')
        })
        .map(x => {
          var link = x.querySelector('.link a')
          if (link) link = link.getAttribute('href')
          var text = x.querySelector('.body')
          if (text) text = text.innerText
          return { text, link }
        })
      return arr
    }
}
