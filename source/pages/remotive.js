module.exports = {
  url: 'http://jobs.remotive.io/?category=engineering',
  query: function query () {
    return [].slice.call(document.querySelectorAll('li')).map(x=> {
			var ss = [].slice.call(x.querySelectorAll('span span')).map(s => s.innerHTML)
			return {
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
