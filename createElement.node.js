/**
 * @exports createElement
 * @param {object} graph - the input graph to convert
 * @param {object} context - a context object to access for interplated variables
 */

module.exports = function createElement(graph, ctx){
 	validateGraph(graph) // throws error if not {element: {attributes}} format
 	// increment indent depth if indent already exists from recursion, or define it with no indent
 	var indent = typeof indent == 'undefined' ? '' : indent + '\t'
 	var [element, props] = Object.entries(graph).pop()
	var outerHTML = new Array
	var innerHTML = new Array

 	for(var prop in props){
 		var attribute = props[prop]
 		switch(prop){
 			case 'textContent':
 				innerHTML.push(attribute)
 				break
 			case 'style':
 				outerHTML.push(formatAttribute('style', formatStyle(attribute)))
 				break
 			case 'childNodes':
 				attribute.forEach(child => innerHTML.push(createElement(child)))
 				break
 			default:
 				outerHTML.push(formatAttribute(prop, attribute))
 		}
	}
	return `${indent}<${element}${outerHTML.join(' ')}>${innerHTML.join('')}</${element}>`
}

/**
 * @param {object} style
 * @return {string}
 * Take object of form {width: "100px", height: "50px"}
 * and return a string `width: 100px; height: 50px;`
 */
function formatStyle(style){
	return Object.entries(style).map(tuple => 
		`${tuple.shift()}: ${tuple.shift()}`
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
	return ` ${prop}="${attribute}"`
}

/**
 * @param {object} graph
 */
function validateGraph(graph){
	// initialize position if it doesn't already exist in context from previous recursion
	var position = typeof position == 'undefined' ? new Array : position

	var pathify = position => position.length ? position.map(String).join('.') : 'the start'
	var assertType = (assertee, type) => {
		if(![String, Object, Function, Array].includes(type))
			throw new Error(`String, Object, Function, Array are the only accepted types.`)
		if(!assertee)
			throw new Error(`At ${pathify(position)}, property must not be falsey.`)
		if(assertee.constructor != type)
			throw new Error(`At ${pathify(position)}, property must be an ${type.name}, got the ${assertee.constructor.name} ${String(assertee)}`)
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
 		position.push(prop)
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