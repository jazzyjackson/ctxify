const FigJam = require('@mixint/figjam')
const BytePipette = require('@mixint/bytepipette')
const http = require('http')
const fs = require('fs')

http.createServer({
    IncomingMessage: require('parsedmessage'),
    ServerResponse: require('serverfailsoft'),
}, (req, res) => ((route) => {
	console.log(
		req.connection.remoteAddress,
		req.method,
		req.url
	)
	if(req.pathname == '/')
		res.writeHead('302',{Location: '/about'}), res.end()
	else
		req.pipe(new route).pipe(res)
})(
	req.pathname.slice(-1) == '/' ? FigJam : BytePipette
)).listen(process.env.PORT || 3000)