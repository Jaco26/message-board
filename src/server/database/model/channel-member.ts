import { query, queryRows } from '../database'

export const addChannelMember = (channelID: string, memberID: string) => (
    query(
        'INSERT INTO channel_member (channel_id, member_id) VALUES ($1, $2)',
        channelID,
        memberID
    )
)