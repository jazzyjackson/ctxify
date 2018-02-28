# mixintCreateElement

a simple global function that turns converts deep objects into a DOM trees

Also every child created from this tree has a props property that offers easy getting and setting of HTML attributes.
```js
mixint.createElement({div: {id: 'whateverYouWant', textContent: 'This becomes a text node'}})
```
