import { getThreadByThreadID } from '../database/model/thread'
import { Router } from 'express'

const router = Router()

router.get('/:thread_id', async (req, res) => {
    try {
        res.json(await getThreadByThreadID(req.params.thread_id))
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router