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

    const { exists, idExists } = useUtils(state)

    const { addUser } = useUsers(state)
    const { addThread } = useThreads(state)
    const { addMessage, removeMessage, buildMessageTree } = useMessages(state)
    const { addGroup, addUserToGroup, addThreadToGroup } = useGroups(state)
 
    const doGetAllGroupsByUserID = (userID: string) => {
        if (!idExists('users', userID)) {
            throw new Error('[doGetAllGroupsByUserID] invalid userID')
        }
        
    }

    const doGetAllGroups = () => Object.values(state.groups)
    
    const doGetGroupByID = (groupID: string) => {
        if (!idExists('groups', groupID)) {
            throw new Error('[doGetGroupByID] invalid groupID')
        }
        const group = state.groups[groupID]
        const threads = group.threads.map(threadID => buildMessageTree(state.threads[threadID].root.id))
        const users = group.users.map(userID => state.users[userID])
        return { group, threads, users }
    }

    const doCreateThread = () => {

    }

    return {
        doCreateThread,
        doGetGroupByID,

    }

}

