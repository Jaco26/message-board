import { State } from './types'
import { useUtils } from './utils'
import { useUsers } from './user'
import { useThreads } from './thread'
import { useMessages } from './message'
import { useGroups } from './group'

export const createDatabase = () => {

    const state: State = {
        users: {},
        groups: {},
        messages: {},
        threads: {},
        messageGraph: {}
    }

    const { idExists } = useUtils(state)


    const { addUser } = useUsers(state)
    const { addThread } = useThreads(state)
    const { addMessage, removeMessage, buildMessageTree } = useMessages(state)
    const { addGroup, addUserToGroup, addThreadToGroup } = useGroups(state)
 

    const doGetAllGroups = () => Object.values(state.groups)

    const doGetGroupsByUserID = (userID: string) => (
        Object.values(state.groups).filter(group => group.users.includes(userID))
    )
    
    const doGetGroupByGroupID = (groupID: string) => {
        if (!idExists('groups', groupID)) {
            throw new Error('[doGetGroupByID] invalid groupID')
        }
        const group = state.groups[groupID]
        const threads = group.threads.map(threadID => buildMessageTree(state.threads[threadID].root.id))
        const users = group.users.map(userID => state.users[userID])
        return { group, threads, users }
    }

    const doCreateThread = (senderID: string, messageContent: string, groupID: string) => {
        const rootMsg = addMessage(senderID, messageContent)
        try {
            const thread = addThread(groupID, rootMsg)
            addThreadToGroup(groupID, thread.id)
            return rootMsg
        } catch (error) {
            removeMessage(rootMsg.id)
        }
    }

    return {
        doCreateThread,
        doGetAllGroups,
        doGetGroupsByUserID,
        doGetGroupByGroupID,
        doAddUserToGroup: addUserToGroup,
        doCreateUser: addUser,
        doCreateGroup: addGroup,
        doSendMessage: addMessage,
    }

}

