import uuid from 'uuid'
import { State, MessageTreeNode, Message } from './types'
import { useUtils } from './utils'

export const useMessages = (state: State) => {

    const { idExists, exists } = useUtils(state)

    const _createMessage = (senderID: string, content: string, destID?: string): Message => ({
        destID,
        senderID,
        content,
        id: uuid.v4(),
        timestamp: new Date().toISOString()
    })

    const addMessage = (senderID: string, content: string, destID?: string) => {
        if (!idExists('users', senderID)) {
            throw new Error('[addMessage] invalid senderID')
        }
        if (!content.trim()) {
            throw new Error('[addMessage] invalid content')
        }
        const msg = _createMessage(senderID, content, destID)
        state.messages[msg.id] = msg
        state.messageGraph[msg.id] = []
        if (destID) {
            state.messageGraph[destID].push(msg.id)
        }
        return msg
    }

    const removeMessage = (messageID: string) => {
        if (!idExists('messages', messageID)) {
            throw new Error('[removeMessage] invalid messageID')
        }
        const msg = state.messages[messageID]  
        if (msg.destID) {
            const idx = state.messageGraph[msg.destID].indexOf(messageID)
            state.messageGraph[msg.destID].splice(idx, 1)
        }
        delete state.messages[messageID]
        delete state.messageGraph[messageID]
        return msg
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

    return { addMessage, removeMessage, buildMessageTree }
}
