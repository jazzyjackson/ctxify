const assert = require('assert')

/**
 * @param {object} graph
 */
module.exports = function validateGraph(graph, position){
	// initialize position if it doesn't already exist in context from previous recursion
	var position = position || new Array

	var pathify = position => {
		return position.length ? position.map(String).join('.') : 'the start'
	}

	var typeEqual = (assertee, type) => {
		assert.ok(['String', 'Object', 'Array'].includes(type),
			`String, Object, Array are the only accepted types - they should be passed to typeEqual as a string.`)
		assert.ok(assertee,
			`At ${pathify(position)}, property must not be falsey.`)
		assert.equal(Object.prototype.toString.call(assertee), `[object ${type}]`,
			`At ${pathify(position)}, property must be a ${type}, got ${String(assertee)}`)
	}

	/**
	 * Inline style is an attribute of a tag, such as:
	 *
	 *	 {"div":{
	 *		"style": {
	 *			"border": "1px solid black",
	 *			"background": "white",
	 *		},
	 *		"id": "someid",
	 *		"textContent": "sometext"
	 *	 }}
	 *
	 *   So here style is an object with string keys and string values
	 */
	var validateStyleObject = style => {
		typeEqual(style, 'Object')
		for(var selector in style){
			position.push(selector)
			typeEqual(selector, 'String')
			typeEqual(style[selector], 'String')
			position.pop()
		}
	}

	/**
	 * style tag includes a map of selectors to rule pairs:
	 *
	 *	 {"style":{
	 *		"*":{
	 *			"box-sizing":"border-box",
	 *		},
	 *		"#someid": {
	 *			"border": "1px solid black",
	 *			"background": "white",
	 *		},
	 *	 }}
	 *
	 *   So here style is an object with string keys and object values, 
	 *   each of which can be validated with same function as inline style.
	 */
	var validateStyleTag = rules => {
	 	for(var selector in rules){
	 		position.push(selector)
	 		validateStyleObject(rules[selector])
	 		position.pop()
		}
	}


	var validateHTMLTag = (props, style) => {
	 	for(var prop in props){
	 		position.push(prop)
	 		switch(prop.toUpperCase()){
	 			case 'STYLE':
	 				validateStyleObject(props[prop])
	 				break
	 			case 'CHILDNODES':
	 				validateChildren(props[prop])
	 				break
	 			default:
	 				// everything else will just be a string
					typeEqual(props[prop], 'String')
	 		}
 			position.pop()
 		}
	}


	var validateChildren = children => {
		typeEqual(children, 'Array')
		children.forEach(child => validateGraph(child, position))
	}

	typeEqual(graph, 'Object')

	assert.equal(Object.entries(graph).length, 1, 
		`At ${pathify(position)}, the graph must have a single key, the top parent element name.`)
	
	let [element, props] = Object.entries(graph).pop()

	position.push(element)

	typeEqual(element, 'String')
	typeEqual(props, 'Object')

	if(element.toUpperCase() == 'STYLE')
		validateStyleTag(props)
	else
		validateHTMLTag(element, props)

	position.pop()
}