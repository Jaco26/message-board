import { queryRows } from '../database'
import * as table from '../entity/table'


export const getThread = async (threadID: string) => {
    console.log(threadID)
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
        console.error(error)
        throw error
    }
}
