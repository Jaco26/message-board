import { query, queryRows } from '../database'
import * as table from '../entity/table'

import { ChannelThread, getThreadsByChannelID } from './thread'

export type Channel = {
    id: string
    name: string
    threads: ChannelThread[]
}

export const createChannel = async (name: string) => {
    try {
        query('INSERT INTO channel (name) VALUES ($1)', [name])
    } catch (error) {
        throw error
    }
}

export const getAllChannels = async (): Promise<Channel[]> => {
    try {
        const channels = await queryRows<table.Channel>('SELECT * FROM channel')
        return channels.map(channel => ({ ...channel, threads: [] }))
    } catch (error) {
        throw error
    }
}

export const getChannelById = async (channelID: string): Promise<Channel> => {
    try {
        const [{ id, name }] = await queryRows<table.Channel>('SELECT * FROM channel WHERE id = $1', channelID)
        const threads = await getThreadsByChannelID(id)
        return { id, name, threads }
    } catch (error) {
        throw error
    }
}
