/**
 * @param {object} graph
 */
module.exports = function validateGraph(graph, position){
	// initialize position if it doesn't already exist in context from previous recursion
	var position = position || new Array

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
		children.forEach(child => validateGraph(child, position))
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