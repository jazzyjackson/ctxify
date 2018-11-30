const stricttype = unknowntype => Object.prototype.toString.call(unknowntype).slice(8, -1)

module.exports = function link(graph){
	if(stricttype(graph) == 'String'){
		return link(require(graph))
	} else if(stricttype(graph) != 'Object'){
		throw new Error(
			`Recieved a graph with type ${stricttype(graph)},` +
			`ctxify.link can only accept graphs of the form {element: {attributes}}`
		)
	} else if(graph.childNodes){
		return Object.assign(graph, {
			childNodes: graph.childNodes.map(child => link(child))
		})
	} else {
		return graph
	}
}