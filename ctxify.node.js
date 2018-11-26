
let mergectx = require('./bin/mergectx')
let validateGraph = require('./bin/validateGraph')

/**
 * @exports ctxify
 * @param {object} graph - the input graph to convert
 * @param {object} context - a context object to access for interplated variables
 */

module.exports = function ctxify(graph, ctx = {}){
	// if graph is a string, try to open it, hoping its a JSON file.
	// boy relative paths will get really screwy, should I do something to resolve them?
	if(graph instanceof String){
		try {
			return ctxify(require(graph), ctx)
		} catch(e) {
			return `<!-- ${e.toString()} -->`
		}
	}
 	validateGraph(graph) // throws error if not {element: {attributes}} format
	/**
	 * @param {object} style
	 * @return {string}
	 * Take object of form {width: "100px", height: "50px"}
	 * and return a string `width: 100px; height: 50px;`
	 * These values ARE compatible with {{ }} templating
	 */
	function formatStyleRules(style, seperator = ' '){
		return Object.entries(style).map(tuple =>
			`${mergectx(tuple[0], ctx)}: ${mergectx(tuple[1], ctx)};`
		).join(seperator)
	}
	/**
	 * @param {string} prop
	 * @param {string} attribute
	 * @return {string}
	 * the leading space is intentional by the way,
	 * so space only exists in <tagName> before each attribute
	 */
	function formatAttribute(prop, attribute){
		return ` ${mergectx(prop, ctx)}="${mergectx(attribute, ctx)}"`
	}

 	var [element, props] = Object.entries(graph).pop()
	var outerHTML = new Array
	var innerHTML = new Array

 	for(var prop in props){
 		var attribute = props[prop]
 		if(element.toUpperCase() == 'STYLE'){
 				innerHTML.push(`\n${mergectx(prop, ctx)}: {${formatStyleRules(attribute)}}\n`)
 		} else switch(prop){
 			case 'textContent':
 				innerHTML.push(mergectx(attribute, ctx))
 				break
 			case 'style':
 				outerHTML.push(formatAttribute('style', formatStyleRules(attribute)))
 				break
 			case 'childNodes':
 				innerHTML.push(...attribute.map(child => ctxify(child, ctx)))
 				break
 			default:
 				outerHTML.push(formatAttribute(prop, attribute))
 		}
	}
	return `<${element}${outerHTML.join(' ')}>${innerHTML.join('')}</${element}>`
}