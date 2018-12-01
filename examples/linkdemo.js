const { ctxify } = require('../ctxify.node.js')
const linkdemo = require('./linkdemo.ohtml.json')

console.log(
	ctxify(linkdemo, {
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