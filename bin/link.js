

const stricttype = unknowntype => Object.prototype.toString.call(unknowntype).slice(8, -1)

module.exports = function link(graph){
	if(stricttype(graph) == 'String'){
		try {
			return link(require(graph))
		} catch(error){
			return {'!': error.toString()}
		}
	} else if(stricttype(graph) != 'Object'){
		throw new Error(
			`Recieved a graph with type ${stricttype(graph)},` +
			`ctxify.link can only accept graphs of the form {element: {attributes}}`
		)
	}

 	var [element, props] = Object.entries(graph).pop()
	if(props.childNodes){
		return {[element]: Object.assign(props, {
			childNodes: props.childNodes.map(child => link(child))
		})}
	} else {
		return graph
	}
}