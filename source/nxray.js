var xray = require('x-ray')
var nightmareDriver = require('x-ray-nightmare')

module.exports = function nightmareXray (waitForSelector) {
	waitForSelector = waitForSelector || 'div'
	// instantiate driver for later shutdown
	var done = nightmareDriver(function init (ctx, nightmare) {
		// `waitForSelector` to appear in DOM before passing output to x-ray
		return nightmare.goto(ctx.url).wait(waitForSelector)
	})
  var x = xray().driver(done)
	// x(url, selector)(fn)
	// x(url, scope, selector)
	// x(html, scope, selector)
	return function nightmareX () {
		var _fn = x.apply(null, arguments)
		return function callback (fn) {
			_fn(dummy)
			function dummy (err, data) {
				fn(err, data, done)
			}
		}
	}
}
