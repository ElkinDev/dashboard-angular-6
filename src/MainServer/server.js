'use strict'

const http = require('http'),
	socketio = require('socket.io'),
	port=8888,
	rt=require('./router')


let server

server=http.createServer(rt.server)
const io=socketio(server)


var numClients = 0;

const accessOrigin=['http://127.0.0.1']

io.set('origins', accessOrigin)
io.origins((origin, callback) => {
	if (accessOrigin.indexOf(origin)===-1)
		callback('origin not allowed', false)
	else
		callback(null, true)
})

let socketIn



server.listen(port, () => console.log(`listening on port ${port}`))
const exporty={
	socket: socketIn
}
module.exports=exporty
