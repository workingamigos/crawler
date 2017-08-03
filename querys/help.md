# Table of Content
1. Examples
    * Example 1
2. Query Function Template
3. Github Pull Request Workflow
4. Learning Material

# 1. Examples
```html
<body class="test"> <p>hello</p> <div class="test"> <p>world</p> </div> </body>
```
```js
document.querySelectorAll('.test') // [body.test, div.test]
document.querySelector('body.test').innerText // "hello

                                                  world"
document.querySelector('body .test').innerText // "world"
document.querySelector('body > .test').innerText // "world"
[...document.querySelectorAll('.test')].map((x) =>{a =x.innerText;return a}) // ["hello↵↵world", "world"]
```

### Example 1
```js
// https://authenticjobs.com/#query=javascript&remote=true
var listings = document.querySelectorAll('#listings > li')
var jobs = [...listings].map(query)
function query (job) {
  return {
    title: job.querySelector('.details h3').innerHTML, // Front-end Developer
    type: job.className,
    company: job.querySelector('.details h4').childNodes[0].textContent.trim(), // GatherContent
    description: job.querySelector('.details span').innerHTML, // We help teams ...
    url: location.origin + job.querySelector('a').getAttribute('href')
  }
}
```
* **[Scraper Sourcecode example](https://github.com/workingamigos/crawler/blob/master/source/pages/authenticjobs%40com%40%40!_!onlyremote%3D1.js#L53)**
* **[See example in Full Screen](http://i.imgur.com/HLMuuCY.png)**
![screenshot](http://i.imgur.com/HLMuuCY.png)


# 2. Query Function Template
```js
    function query () {
      return         {
        // the job's publish date
        publishDate  : null,
        publishDate  : '2017/8/2',  // 'y/m/d' 
        // technologies/techniques used/needed for/in the job
        skills       : ['css', 'html5' /*, ...*/],
        // list of requirements without which the job is not available
        requirements : ['1 year experience', 'english speaker' /*, ...*/],
        // job title
        title        : 'Remote Front-End Developer',
        // remote (fulltime/partime/project/....)
        type         : 'Remote project',
        // fixed rate OR per hour if the contract pays per hour?
        payment      : '15 USD/hour',
        // how long does the contract last or when is the deadline(s)?
        duration     : '3 months',
        // if the contract pays for results, what is the max budget?
        budget       : '4000 USD',
        /*
           a very long text description of the job
           
        */
        description  : '... mixed custom text + html content ...',
        // subtitle (~1 sentence to explain the job title)
        details      : '',
        //name of company
        company      : 'Clevertech',
        //Where is the company
        location     : 'remote',
        
        benefits     : null,
        application  : '',
        url          : 'https://authenticjobs.com/jobs/29571/remote-front-end-developer'
      }
    }
```

# 3. Github Pull Request Workflow
Prepare:
You github profile is your "portfolio" where you will have a list of all your repositories. Over time this list will grow and you can PIN some of them to your "homepage". In order not to SPAM this with stuff that you contribute to, but you dont want to have on your profile, it is recommended to make an organization called: "username-contribution"
https://github.com/serapath-contribution
***WORKFLOW (simple with no terminal involved)***
*1a*. go to a repo that you did not create but want to collaborate on and press FORK
*1b*. choose your "username-contribution" organization.
*2*.got to your forked version and edit files online by (adding, removing, changing existing repository content)
*3*.when you are done, click "make pull request" (and choose the original repository
*4*.wait for "upstream" to merge your changes (=accept your pull request) or alternatively see discussion on your pull request 

# 4. Learning Material
List of useful Javascript to write good `query` functions

### CSS selectors
* read http://www.cheetyr.com/css-selectors
* https://gist.github.com/smutnyleszek/809a69dd05e1d5f12d01

### `document.querySelectorAll(selector)`
* https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
* https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
* https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

### Others
1. Spread Syntax [...]
* https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_operator
2. nodelist (document.querySelectorAll() would return a nodelist)  NOTE: nodelist is not an array!!
* https://www.w3schools.com/js/js_htmldom_nodelist.asp
