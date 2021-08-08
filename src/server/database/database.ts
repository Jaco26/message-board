import uuid from 'uuid'

type IdDict<T> = {
    [key: string]: T
}

type User = {
    id: string
    username: string
    groups: string[] // list of group IDs
}

type Group = {
    id: string
    groupname: string
    users: string[] // list of user IDs
    threads: string[] // list of Thread IDs
}

type Message = {
    id: string
    timestamp: string 
    senderID: string // user ID of person who sent message
    destID: string // either a thread ID or a message ID -- is original post if is thread ID else is reply
    content: string
}

type Thread = {
    id: string
    groupID: string // ID of group thread is present in
    root: Message
}


type State = {
    users: IdDict<User>
    groups: IdDict<Group>
    messages: IdDict<Message>
    threads: IdDict<Thread>
    messageGraph: IdDict<string[]> // adjacency list with keys being messageID and values being lists of messageID children
}

const state: State = {
    users: {},
    groups: {},
    messages: {},
    threads: {},
    messageGraph: {}
}

const get = (key: keyof State) => Object.values(state[key])
const exists = <T extends keyof State, U extends keyof State[T]>(key: T, subkey: U, value: string) => get(key).some(x => x[subkey] === value)

type MessageTreeNode = {
    message: Message,
    replies: MessageTreeNode[]
}

const buildMessageTree = (nodeID: string) => {
    const rv: MessageTreeNode[] = []
    for (let i = 0; i < state.messageGraph[nodeID].length; i++) {
        const childID = state.messageGraph[nodeID][i]
        rv.push({
            message: state.messages[childID],
            replies: buildMessageTree(childID)
        })
    }
    return rv
}

const createUser = (username: string): User => ({
    username,
    id: uuid.v4(),
    groups: []
})

const createGroup = (groupname: string): Group => ({
    groupname,
    id: uuid.v4(),
    users: [],
    threads: []
})

const createMessage = (destID: string, senderID: string, content: string): Message => ({
    destID,
    senderID,
    content,
    id: uuid.v4(),
    timestamp: new Date().toISOString(),
})

const createThread = (groupID: string, root: Message): Thread => ({
    groupID,
    root,
    id: uuid.v4(),
})

export const addUser = (username: string) => {
    if (exists('users', 'username', username)) {
        throw new Error('[addUser] Invalid username')
    }
    const user = createUser(username)
    state.users[user.id] = user
}
export const addGroup = (name: string) => {
    if (exists('groups', 'groupname', name)) {
        throw new Error('[addGroup] Invalid groupname')
    }
    const group = createGroup(name)
    state.groups[group.id] = group
}
export const addMessage = (destID: string, senderID: string, content: string) => {
    if (!exists('threads', 'id', destID) || !exists('messages', 'id', destID)) {
        throw new Error('[addMessage] Invalid destID')
    }
    if (!exists('users', 'id', senderID)) {
        throw new Error('[addMessage] Invalid senderID')
    }
    if (!content.trim()) {
        throw new Error('[addMessage] Invalid content')
    }
    const message = createMessage(destID, senderID, content)
    state.messages[message.id] = message
    state.messageGraph[destID].push(message.id)
    state.messageGraph[message.id] = []
    return message
}
export const addThread = (groupID: string, destID: string, senderID: string, content: string) => {
    if (!exists('groups', 'id', groupID)) {
        throw new Error('[addThread] Invalid groupID')
    }
    const thread = createThread(groupID, addMessage(destID, senderID, content))
    state.threads[thread.id] = thread
}


export const getAllGroups = () => Object.values(state.groups)
export const getGroupIDsByUserID = (userID: string) => state.users[userID].groups
export const getGroupByID = (groupID: string) => {
    if (!exists('groups', 'id', groupID)) {
        throw new Error('[getByGroupId] Invalid groupID')
    }
    const group = state.groups[groupID]
    const threads = group.threads.map(threadID => buildMessageTree(state.threads[threadID].root.id))
    const users = group.users.map(userID => state.users[userID])
}