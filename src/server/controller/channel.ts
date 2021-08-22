import { Router } from 'express'

import { createChannel, getAllChannels, getChannelById } from '../database/model/channel'

const router = Router()

router.get('/', async (req, res) => {
    try {
        res.json(await getAllChannels())
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/', async (req, res) => {
    try {
        await createChannel(req.body.name as string)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:channel_id', async (req, res) => {
    try {
        res.json(await getChannelById(req.params.channel_id))
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router