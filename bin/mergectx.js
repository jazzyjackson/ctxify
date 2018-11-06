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
module.exports = function mergectx(str, ctx){
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