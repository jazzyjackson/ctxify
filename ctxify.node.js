
let mergectx = require('./bin/mergectx')
let validateGraph = require('./bin/validateGraph')

/**
 * @exports ctxify
 * @param {object} graph - the input graph to convert
 * @param {object} context - a context object to access for interplated variables
 */

module.exports = function ctxify(graph, ctx = {}){
 	validateGraph(graph) // throws error if not {element: {attributes}} format
 	mergectx = mergectx.bind(ctx)

 	var [element, props] = Object.entries(graph).pop()
	var outerHTML = new Array
	var innerHTML = new Array

 	for(var prop in props){
 		var attribute = props[prop]
 		switch(prop){
 			case 'textContent':
 				innerHTML.push(mergectx(attribute))
 				break
 			case 'style':
 				outerHTML.push(formatAttribute('style', formatStyle(attribute)))
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

/**
 * @param {object} style
 * @return {string}
 * Take object of form {width: "100px", height: "50px"}
 * and return a string `width: 100px; height: 50px;`
 * These values ARE compatible with {{ }} templating
 */
function formatStyle(style){
	return Object.entries(style).map(tuple =>
		tuple.map(mergectx).join(': ')
	).join('; ')
}
/**
 * @param {string} prop
 * @param {string} attribute
 * @return {string}
 * the leading space is intentional by the way,
 * so space only exists in <tagName> before each attribute
 */
function formatAttribute(prop, attribute){
	return ` ${mergectx(prop)}="${mergectx(attribute)}"`
}