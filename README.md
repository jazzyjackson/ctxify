# ctxify
## JSON-driven templating library
### merge context data with HTML represented as JSON graph 


Clientside, presents a simple global function that converts deep objects into DOM trees

Also every child created from this tree has a props property that offers easy getting and setting of HTML attributes.

```js
ctxify({div: {id: 'whateverYouWant', textContent: 'This becomes a text node'}})
```

style can be a string that overwrites any present styleattribute, or key value pairs that are programmatically applied when you assign the object to style.
You get to use class, not classNames or classList,
classList is okay too if you have an array.


Serverside, provides a module for server side rendering, interpolating data objects into your HTMLX objects and returning the HTML string.

This is presently syncronous, but it doesn't have to be...

## Curent Version: 0.1.0

Serverside interpolates context with htmlx

## Next Version: 0.2.0

More documentation for serverside & clientside
Clientside context interpolation is coming up next