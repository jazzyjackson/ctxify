const ctxify = require('../ctxify.node.js')
const interpolateDemoHTMLX = require('./interpolatedemo.htmlx.json')

console.log(
	ctxify(interpolateDemoHTMLX, {
		data: {
			innerdata: {
				id: "something unique"
			}
		},
		style: {
			width: 444,
			height: 222
		}
	})
)