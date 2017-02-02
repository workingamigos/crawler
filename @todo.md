data = {
  date:
  skills:
  requirements:
  title:
  type: job / freelance
  payment: fixed / per hour
  duration:
  budget:
  description:
  details:
  company:
  location:
  benefits:
}

//////////////////////////////////////////////////////////////////////////////

AUTHENTIC JOBS - https://authenticjobs.com/#onlyremote=1

date: document.querySelector('#the_listing .description #posted').innerText
skills:
requirements:
title: document.querySelector('.row-content .column h1').innerText,
type: document.querySelectorAll('.details li')[0].innerText
payment: fixed / per hour
duration:
budget:
description: text
/*@TODO go through all p and concatinate them
  var nodes = document.querySelectorAll('#the_listing .description p')
  var text
  nodes.forEach (function(p){
    text = text + '\n' + p
  })
  return text
*/
details: document.querySelector('#the_listing .description').innerText
company: document.querySelector('#the_company .headings h1').innerText
location: document.querySelectorAll('.details li')[1].innerText
benefits:
application: document.querySelector('#the_company #company_extras #company_links a').href

//////////////////////////////////////////////////////////////////////////////

BOUNTY SOURCE - https://www.bountysource.com/

date:
/*
var nodes = document.querySelectorAll('.secondary-text')
var text
nodes.forEach(function(t){
  text = t.innerText
  text = text.split(' ') //returns array of strings
  if (text.includes('Featured')) { text.pop() }
  while (text.length > 3) { text.shift() }
  text = text.join(' ')
})
*/
skills:
requirements:
title:
type: job / freelance
payment: fixed / per hour
duration:
budget: document.querySelectorAll('.bounty-description')[0].innerText.split('bounty')[0].split('a')[1]
description: document.querySelectorAll('.bounty-description')[0].innerText.split('bounty')[1]
details:
company:
/*
var nodes = document.querySelectorAll('.bounty-description')
var text
var company = []
nodes.forEach(function(t){
  text = t.innerText
  text = text.split(' ')
  text = text.shift()
  console.log(text)
})
*/
location:
benefits:

//////////////////////////////////////////////////////////////////////////////

CAREER BUILDER - careerbuilder.com/jobs-javascript-remote

date: document.querySelector('.main #job-begin-date').innerText
skills:
requirements:
title: document.querySelector('.main h1').innerText
type: document.querySelectorAll('.job-facts .tag')[0].innerText
payment: fixed / per hour
duration:
budget:
/*
var nodes = document.querySelectorAll('.job-facts .tag')
nodes.forEach(function (tag) {
  tag = tag.innerText
  if (tag.includes('$')) {
    budget = tag
  }
  console.log(budget)
})
*/
description: document.querySelector('.main .description').innerText
details:
company: document.querySelector('.main #job-company-name').innerText.split('•')[0]
location: document.querySelector('.main #job-company-name').innerText.split('•')[1]
benefits:

//////////////////////////////////////////////////////////////////////////////

CW JOBS- https://www.cwjobs.co.uk/jobs/remote/in-london?page=6

date: document.querySelector('.job-content .date-posted').innerText
skills:
requirements:
title: document.querySelector('.job-content h1').innerText
type: document.querySelector('.job-content .job-type').innerText
payment: fixed / per hour
duration:
budget: document.querySelector('.location-salary .salary').innerText
description: document.querySelector('.job-description').innerText
details:
company: document.querySelector('.job-content .company').innerText
location: document.querySelector('.location-salary .location').innerText
benefits:

//////////////////////////////////////////////////////////////////////////////

FREELANCER.COM

date:
skills: document.querySelector('.project-view-landing-required-skill').innerText
requirements:
title:
type: job / freelance
payment: fixed / per hour
duration:
budget: document.querySelector('.project-statistic-value').innerText
description: document.querySelector('.project-description').innerText
details:
company:
location:
benefits:

//////////////////////////////////////////////////////////////////////////////

FREELANCERMAP.COM - http://www.freelancermap.com/

date:
skills: document.querySelector('#project .project-categories').innerText
requirements:
title: document.querySelector('#project .headline-lightblue').innerText
type: document.querySelectorAll('#project .project-details .project-detail-description')[0].innerText
payment: fixed / per hour
duration: document.querySelectorAll('#project .project-details .project-detail-description')[2].innerText
budget:
description: document.querySelector('.projectcontent').innerText.split(" Apply now")[1]
details:
company:
location: document.querySelectorAll('#project .project-details .project-detail-description')[4].innerText
benefits:
