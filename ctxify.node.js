
const link        = require('./bin/link.js')
const validate    = require('./bin/validate.js')
const interpolate = require('./bin/interpolate.js')
const renderHTML  = require('./bin/renderHTML.js')

/**
 * @exports ctxify
 * @param {object} graph - the input graph to convert
 * @param {object} context - a context object to access for interplated variables
 */

function ctxify(graph, ctx){
	// -> link            // re-attach JSON files references as childNodes
	//   -> validate      // walk the entire graph checking that types look as expected
	//     -> interpolate // merge the ctx with the validated & linked graph
	//       -> render    // walk the entire graph and return a string of HTML
	return renderHTML(interpolate(validate(link(graph)),ctx))
	//                      \_ interpolate(graph , ctx)_/
}

module.exports = {link, validate, interpolate, renderHTML, ctxify}