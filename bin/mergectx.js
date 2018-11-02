//let delimeters = require('./conf/app.conf').delimeters.split()
// left||{{ right||}}


module.exports = function mergectx(str){
	let capture = /{{([a-zA-Z0-9.]+?())}}/g
	let interpolate = (match, captured) => {
		let ctx = Object.assign({}, this) // copy 'this' context
		let keys = captured.split('.')
		while(keys.length && ctx){
			ctx = ctx[keys.shift()]
		}
		return keys.length ? 'undefined' : ctx
	}
	return str.replace(capture, interpolate)
}

// IDEA: supply multiple templates and merge templates, multiple contexts to merge contexts
// IDEA: also regex for {{||}}
// IDEA: move all the 'assertTye' to some expansion of an assertlibrary
// IDEA: maybe look up the source code to JSON.stringify pretty print to see how it does it