import { Server as HTTPServer } from 'http'

import { Server, ExtendedSocket } from './socket-io'


export const configureWebsocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:8080'
        }
    })

    // register middleware which checks the username and allows the connection
    io.use((s, next) => {
        const socket = s as ExtendedSocket
        const { username } = socket.handshake.auth
        if (!username) {
            return next(new Error('invalid username'))
        }
        socket.username = username
        next()
    })

    // upon connection we will send all existing users to the client
    io.on('connection', s => {
        const users = []
        for (let [id, s] of io.of('/').sockets) {
            const { username } = s as ExtendedSocket
            users.push({
                userID: id,
                username
            })
        }
        const socket = s as ExtendedSocket
        socket.emit('users', users)
        socket.broadcast.emit('user connected', {
            userID: socket.id,
            username: socket.username
        })
    })

    return io
}