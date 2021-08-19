import { query } from '../database'

type Message = {
    id: string
    content: string
    sender_id: string
    dest_id: string
    timestamp: string
}

export const get = (rootID: string) => (
    Promise.all([
        query<Message>(
            `SELECT * FROM message WHERE id = $1`,
            [rootID]
        ),
        query<Message[]>(
            `WITH RECURSIVE message_tree AS (
                    SELECT * FROM message
                    WHERE dest_id = $1
                UNION
                    SELECT m.*
                    FROM message m
                    JOIN message_tree mt ON mt.id = m.dest_id
            )
            SELECT * FROM message_tree`,
            [rootID]
        )
    ])

)
