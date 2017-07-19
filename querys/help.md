## List of useful Javascript to write good `query` functions

### CSS selectors
* read http://www.cheetyr.com/css-selectors
* https://gist.github.com/smutnyleszek/809a69dd05e1d5f12d01

### `document.querySelectorAll(selector)`
* https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
* https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
* https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll


**Example**
```html
<body class="test"> <p> hello </p> <div class="test"> <p> world </p> </div> </body>
```
```js
document.querySelectorAll('.hello') // [body, div]
document.querySelector('body.hello').innerText // hello
document.querySelector('body > .hello').innerText // world
[...document.querySelectorAll('.hello')].join(' - ') // hello - world
```
