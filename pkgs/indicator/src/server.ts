import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import indicator from './indicator'

const port = 6969
const app = express()

const server = createServer(app)

const io = new Server(server, {
	cors: {
		origin: '*',
	}
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

app.use(express.static(__dirname + '/public'))

indicator((reading: any, display: any, stable: any) => {
	io.emit('reading', reading)
	io.emit('display', display)
	io.emit('stable', stable)
})

server.listen(port, () => {
	console.log(`server started at port ${port}`)
})

const kill = () => {
	console.log('kill command')
  io.disconnectSockets()
  process.exit(-1)
}

process.on('SIGHUP', () => kill())
process.on('SIGTERM', () => kill())