import { createServer } from 'http'

import express from 'express'
import history from 'connect-history-api-fallback'

import { configureWebsocket } from './websocket'

const PORT = process.env.PORT || 3500

const app = express()

app.get('/api/groups', (req, res) => {

})

app.get('/api/groups/:userID', (req, res) => {

})

app.get('/api/group/:groupID', (req, res) => {

})

const httpServer = createServer(app)

configureWebsocket(httpServer)

app.use((req, res, next) => {
    console.log(req.method)
    next()
})

app.use(express.static('dist/client'))

app.use(history())

httpServer.listen(PORT, () => {
    console.log('Server listening on port:', PORT)
})