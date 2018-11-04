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
module.exports = function mergectx(str){
	let capture = /{{([a-zA-Z0-9.]+)}}/g
	let interpolate = (match, captured) => {
		let ctx = Object.assign({}, this) // copy 'this' context
		let keys = captured.split('.')
		while(keys.length && ctx){
			ctx = ctx[keys.shift()] 
		}
		return ctx
	}
	return str.replace(capture, interpolate)
}