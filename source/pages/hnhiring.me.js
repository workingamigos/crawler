var request = require('superagent')
var nightmare = require('nightmare')

module.exports = function execute (opts, report) {
  opts = opts || { show: false }
  var nm = nightmare(opts)
  nm.goto('http://hnhiring.me/')
    .evaluate(query)
    .end()
    .run(collect)

    function collect (error, data) {
      if (error) return console.log(error)
      report(null, data)
    }
    function query () {
      return document.title
    }
}
