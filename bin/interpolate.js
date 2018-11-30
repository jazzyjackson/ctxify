/**
 * @exports mergectx
 * @param {string} str - some key or property name from the HTMLX object
 * @context {object} this - to use this function you must bind it to some
 * object you wish to use as the data source:
 * mergectx searches for a delimeter pattern '{{ }}' and splits its contents
 * into an array of the dot-notation key names.
 * The context object is traversed for the provided key name until it reaches
 * the end of the dot-notation-string OR the new context becomes undefined.
 */

// this can be updated to async - just have to do an ugly 'await Promise.all(graph.map())'

module.exports = function interpolate(graph, ctx){
	let fragment = {}
	for(var oldKey in graph){
		let newKey = expand(oldKey, ctx)
		switch(Object.prototype.toString.call(graph[oldKey])){
			case '[object String]':
				fragment[newKey] = expand(graph[oldKey], ctx)
				break
			case '[object Array]':
				fragment[newKey] = graph[oldKey].map(each => interpolate(each, ctx))
				break
			case '[object Object]':
				fragment[newKey] = interpolate(graph[oldKey], ctx)
				break
		}
	}
	return fragment
}

// this is gonna get a lot more complicated.
// I'm gonna have to search object keys for 'some.assumed.array[]' and repeat the pattern inside for each element.
function expand(str, ctx){
	return str.replace(/{{([a-zA-Z0-9.]+)}}/g, (match, captured) => {
		let localctx = Object.assign({}, ctx) // create copy of ctx
		let keys = captured.split('.')
		while(keys.length && localctx){
			localctx = localctx[keys.shift()] 
		}
		return localctx
	})
}
/*
// capture keyword [[each, if]]
{{#(\w)\s([a-zA-Z0-9.]+)}}}}

return an empty object for failed conditionals, return array of nodes for loops...

will have to revamp the switch case above: when I grab a key, I have to check if its a tagName or a #(){}...

*/