# mixintCreateElement

a simple global function that turns converts deep objects into a DOM trees

Also every child created from this tree has a props property that offers easy getting and setting of HTML attributes.
```js
mixint.createElement({div: {id: 'whateverYouWant', textContent: 'This becomes a text node'}})
```

style can be a string that overwrites any present styleattribute, or key value pairs that are programmatically applied when you sign the object to style.
You get to use class, not classNames or classList,
classList is okay too if you have an array.
