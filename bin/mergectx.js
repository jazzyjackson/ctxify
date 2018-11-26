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
module.exports = function mergectx(graph, ctx){
	let fragment = {}
	for(var oldKey in graph){
		let newKey = interpolatectx(oldKey, ctx)
		switch(Object.prototype.toString.call(graph[oldKey])){
			case '[object String]':
				fragment[newKey] = interpolatectx(graph[oldKey], ctx)
				break
			case '[object Array]':
				fragment[newKey] = graph[oldKey].map(each => mergectx(each, ctx))
				break
			case '[object Object]':
				fragment[newKey] = mergectx(graph[oldKey], ctx)
				break
		}
	}
	return fragment
}



function interpolatectx(str, ctx){
	let capture = /{{([a-zA-Z0-9.]+)}}/g
	let interpolate = (match, captured) => {
		let localctx = Object.assign({}, ctx) // create copy of ctx
		let keys = captured.split('.')
		while(keys.length && localctx){
			localctx = localctx[keys.shift()] 
		}
		return localctx
	}
	return str.replace(capture, interpolate)
}