/**
 * @exports createElement
 * @param {object} graph - the input graph to convert
 * @param {object} context - a context object to access for interplated variables
 */

module.exports = function createElement(graph, ctx){
 	validateGraph(graph) // throws error if not {element: {attributes}} format
 	let [element, props] = Object.entries(graph).pop()
 	for(var prop in props){
 		let attribute = props[prop]
 		let tagName = element
 		let outerHTML = new Array
 		let innerHTML = new Array

 		switch(prop){
 			case 'textContent':
 				innerHTML.push(validateTextContent(attribute))
 				break
 			case 'style':
 				outerHTML.push(formatStyle(validateStyle(attribute)))
 				break
 			case 'childNodes':
 				validateChildren(attribute).forEach(child => innerHTML.push(createElement(child)))
 				break
 			default:
 				outerHTML.push(formatAttribute(attribute))
 		}
	}
}

/**
 * @param {object} graph
 */
function validateGraph(graph){
	var position = position || new Array

	var pathify = position => position.length ? position.map(String).join('.') : 'the start'
	var assertType = (assertee, type) => {
		if(![String, Object, Function, Array].includes(type))
			throw new Error(`String, Object, Function, Array are the only accepted types.`)
		if(!assertee)
			throw new Error(`At ${pathify(position)}, property must not be falsey.`)
		if(assertee.constructor != Object)
			throw new Error(`At ${pathify(position)}, property must be an ${String(type)}.`)
	}
	var validateStyle = style => {
		assertType(style, Object)
		for(var selector in style){
			position.push(selector)
			assertType(selector, String)
			assertType(style[selector], String)
			position.pop()
		}
	}

	var validateChildren = children => {
		assertType(children, Array)
		children.forEach(validateGraph)
	}

	assertType(graph, Object)

	if(Object.entries(graph).length != 1)
		throw new Error(`At ${pathify(position)}, the graph must have a single key, the top parent element name.`)
	
	let [element, props] = Object.entries(graph).pop()

	position.push(element)

	assertType(element, String)
	assertType(props, Object)

 	for(var prop in props){
 		position.push(props[prop])
 		switch(prop){
 			case 'style':
 				validateStyle(props[prop])
 				break
 			case 'childNodes':
 				validateChildren(props[prop])
 				break
 			default:
 				// everything else will just be a string
				assertType(props[prop], String)

 		}
 		position.pop()
	}
	position.pop()
}
 /**
  * TODO: regex every property text for ${} pattern... or @
  */