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


# https://remoteok.io/remote-js-jobs
```js

let listing = document.querySelectorAll('#jobsboard tr.job')
let jobs = [...listing].map(query)
function query (job) {
  let tags = job.querySelectorAll('#jobsboard td.tags .tag h3')
  let tagArray = [...tags].map((tag)=>{return tag.innerText})
  return {
    title: job.querySelector('td.position h2').innerText,
    company: job.querySelector('td.position h3').innerText,
    tags: tagArray.toString(),
    url: job.querySelector('.company_and_position > a').href,
    time: job.querySelector('.time > a').innerText
  }
}
```

# http://www.careerbuilder.com/jobs-javascript-remote?cbrecursioncnt=1
```js

var listings = document.querySelectorAll('.jobs>.job-row')
var jobs = [...listings].map(query)
function query(job){
	return{

		title: job.querySelector('h2.show-for-medium-up').innerText,
		type: job.querySelector('.employment-info').innerText,
		company: [...job.querySelectorAll('.job-text')][2].innerText,
		description: job.querySelector('.job-description').innerHTML,
		url: location.origin + job.querySelector('a').getAttribute('href')
	
	}
}
```

# https://www.bountysource.com/search?query=javascript
```js

var projects = document.querySelectorAll('div > table tr[ng-repeat]');
var jobs = [...projects].map(function(job){
	return {
		title: job.querySelector("td a").innerText,
		payment: job.querySelector("td span").innerText, 
		url: job.querySelector("td span[ng-href]").baseURI + job.querySelector("td span[ng-href]").attributes.href.value,
		description: null,
		details: null,
		company: null,
		location: null,
		benifits: null,
		application: null,
		publishDate: null,
		skills: null,
		requirements: null,
		type: null,
		duration: null,
		budget: null
	};
})
```
