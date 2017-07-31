# Queries

# https://authenticjobs.com/#query=javascript&remote=true
```js
var listings = document.querySelectorAll('#listings > li')
var jobs = [...listings].map(query)
function query (job) {
  return {
    title: job.querySelector('.details h3').innerHTML, // Front-end Developer
    type: job.className,
    company: job.querySelector('.details h4').childNodes[0].textContent.trim(), // GatherContent
    description: job.querySelector('.details span').innerHTML, // We help teams ...
    url: location.origin + job.querySelector('a').getAttribute('href')
    // ...
    // ...
  }
}
```



# http://frontenddeveloperjob.com/
```js
var jobs = document.querySelectorAll(".jobs > .job")

var jobInfo = [...jobs].map(query)

function query(job) {
	return {
		title: job.querySelector('.job > .title a').innerText,
		company: job.querySelector('.job > .title > .employer').firstElementChild.nextSibling.nodeValue,
		position: job.querySelector('.job > .title > .employer').lastChild.nodeValue,
		tag: job.querySelector('.job .tags > .tag:last-child').innerText,
		time: job.querySelector('.job > .time').innerText,
		url: job.querySelector('.title > a').href
	}
}
```

