import { queryRows } from '../database'
import * as table from '../entity/table'

export type ChannelThread = {
    id: string
    root_message: table.Message
}

export const getThreadsByChannelID = async (channelID: string): Promise<ChannelThread[]> => {
    try {
        const threads = await queryRows<table.Thread>(
            'SELECT * FROM thread WHERE channel_id = $1',
            channelID
        )
        return Promise.all(
            threads.map(async ({ id, root_id, channel_id }) => {
                const [root_message] = await queryRows<table.Message>(
                    'SELECT * FROM message WHERE id = $1',
                    root_id
                )
                return { id, root_message }
            })
        ) 
    } catch (error) {
        throw error
    }
}

export type Thread = {
    id: string
    channel_id: string
    root_id: string
    messages: table.Message[]
}

export const getThreadByThreadID = async (threadID: string): Promise<Thread> => {
    try {
        const [{ id, channel_id, root_id  }] = await queryRows<table.Thread>(
            'SELECT * FROM thread WHERE id = $1',
            threadID
        )
        const messages = await queryRows<table.Message>(
            `WITH RECURSIVE message_graph AS (
                        SELECT * FROM message
                        WHERE dest_id = $1
                    UNION
                        SELECT m.* FROM message m
                        JOIN message_graph mt ON mt.id = m.dest_id
            )
            SELECT * FROM message_graph
            UNION
            SELECT * FROM message WHERE id = $1`,
            root_id
        )
        return { id, channel_id, root_id, messages }
    } catch (error) {
        throw error
    }
}
