import { query } from '../database'


export const createChannel = (name: string) => (
    query('INSERT INTO channel (name) VALUES ($1)', [name])
)


export interface ChannelSlim {
    id: string
    name: string
}

export const getSlimChannelById = (id: string) => (
    query<ChannelSlim>('SELECT * FROM channel WHERE id = $1', [id])
)


export interface ChannelFull {
    id: string
    name: string
    memberIDs: string[]
    threadIDs: string[]
}

export const getFullChannelById = (id: string) => (
    Promise.all([
        query<ChannelFull>(
            `SELECT
                channel.id,
                channel.name,
            `
        )
    ])

)