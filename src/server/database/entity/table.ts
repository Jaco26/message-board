export type Member = {
    id: string
    name: string
}

export type Channel = {
    id: string
    name: string
}

export type ChannelMember = {
    channel_id: string
    member_id: string
}

export type Message = {
    id: string
    content: string
    sender_id: string
    dest_id: string
    timestamp: string
}

export type Thread = {
    id: string
    channel_id: string
    root_id: string
}