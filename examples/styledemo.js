const { ctxify } = require('../ctxify.node.js')
const styledemo = require('./styledemo.ohtm.json')

console.log(
	ctxify(styledemo, {
		data: {
			innerdata: {
				id: "somethingunique"
			}
		},
		style: {
			width: 444,
			height: 222
		}
	})
)