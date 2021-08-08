export interface ChatMessage {
    timestamp: string
    content: string
}

export interface User {
    userID: string
    username: string
    messages: ChatMessage[]
    hasNewMessages: boolean
}

export interface ClientUser extends User {
    connected: boolean
    isSelf: boolean
}