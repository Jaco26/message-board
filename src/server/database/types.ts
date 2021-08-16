
export type IdDict<T> = { [key: string]: T } 

export type Group = {
    id: string
    groupname: string
    users: string[] // list of user IDs
    threads: string[] // list of Thread IDs
}

export type Message = {
    id: string
    timestamp: string 
    senderID: string // userID of person who sent message
    destID?: string //  parent messageID, undefined if is Thread root
    content: string
}

export type MessageTreeNode = {
    message: Message,
    replies: MessageTreeNode[]
}

export type Thread = {
    id: string
    groupID: string
    root: Message
}

export type User = {
    id: string
    username: string
    groups: string[] // list of group IDs
}

export type State = {
    groups: IdDict<Group>
    messages: IdDict<Message>
    messageGraph: IdDict<string[]>
    threads: IdDict<Thread>
    users: IdDict<User>
}