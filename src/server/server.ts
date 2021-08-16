import { createServer } from 'http'

import express from 'express'
import history from 'connect-history-api-fallback'

import { configureWebsocket } from './websocket'
import { createDatabase } from './database/database'

const db = createDatabase()

const players = db.doCreateGroup('players')

const bigCoolGuy = db.doCreateUser('big_cool_guy')
const ladyLadyLady = db.doCreateUser('ladyladylady')
const iAmADog = db.doCreateUser('i_m_a_dog')
const iLoveBeez = db.doCreateUser('i_luv_beez')

db.doAddUserToGroup(players.id, bigCoolGuy.id)
db.doAddUserToGroup(players.id, iAmADog.id)
db.doAddUserToGroup(players.id, ladyLadyLady.id)
db.doAddUserToGroup(players.id, iLoveBeez.id)

const rootMsg = db.doCreateThread(bigCoolGuy.id, 'Hello I think we are great!', players.id)
const ldyMsg = db.doSendMessage(ladyLadyLady.id, 'Ya I agree! it is the best!', rootMsg?.id)
db.doSendMessage(iAmADog.id, 'woof', ldyMsg.id)
db.doSendMessage(iLoveBeez.id, 'buzz buzz where is all the honeyyyy?', rootMsg?.id)


const PORT = process.env.PORT || 3500

const app = express()

app.get('/api/groups', (req, res) => {
    res.json(db.doGetAllGroups())
})

app.get('/api/groups/:userID', (req, res) => {
    res.json(db.doGetGroupsByUserID(req.params.userID))
})

app.get('/api/group/:groupID', (req, res) => {
    res.json(db.doGetGroupByGroupID(req.params.groupID))
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