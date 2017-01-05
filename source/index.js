var bulk = require('bulk-require')
var pages = bulk(__dirname, ['pages/**/*.js']).pages

var nightmare = require('nightmare')
var nm = nightmare({ show: false })

Object.keys(pages).forEach(name => {
	var page = pages[name]
	var url = page.url
	var query = page.query
	nm.goto(url).evaluate(query).end().then(success).catch(fail)
	function success (html) { console.log(html) }
	function fail (error) { console.error('Search failed:', error) }
})
