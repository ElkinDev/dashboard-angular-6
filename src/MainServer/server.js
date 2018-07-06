'use strict'

const http = require('http'),
	socketio = require('socket.io'),
	port=8888,
	rt=require('./router')


let server

server=http.createServer(rt.server)
const io=socketio(server)


var numClients = 0;

const accessOrigin=['http://localhost:4200']

io.set('origins', accessOrigin)
io.origins((origin, callback) => {
	if (accessOrigin.indexOf(origin)===-1)
		callback('origin not allowed', false)
	else
		callback(null, true)
})

let socketIn

io.on('connection', socket=>{
	socketIn=socket
    var clientIp = socket.request.connection.remoteAddress
	console.log('conectadoooo')
	socket.on('getPlan', data=>{
		socket.emit('plan', 'veaamos')
	})
	try{
		socket.on('disconnect', ()=>{
			console.log('se desconecta el hombre', __filename)
			numClients--
		});
	}catch(ex){
		debug(ex);
	}

})


server.listen(port, () => console.log(`listening on port ${port}`))
const exporty={
	socket: socketIn
}
module.exports=exporty
