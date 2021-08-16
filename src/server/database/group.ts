import uuid from 'uuid'
import { State, Group } from './types'
import { useUtils } from './utils'


export const useGroups = (state: State) => {

    const { exists } = useUtils(state)

    const _groupnameExists = (groupname: string) => exists('groups', 'groupname', groupname)

    const _createGroup = (groupname: string): Group => ({
        groupname,
        id: uuid.v4(),
        users: [],
        threads: []
    })

    const addGroup = (groupname: string) => {
        if (_groupnameExists(groupname)) {
            throw new Error('[addGroup] invalid groupname')
        }
        const group = _createGroup(groupname)
        state.groups[group.id] = group
        return group
    }

    const addUserToGroup = (groupID: string, userID: string) => {
        state.groups[groupID].users.push(userID)
        state.users[userID].groups.push(groupID)
    }

    const addThreadToGroup = (groupID: string, threadID: string) => {
        state.groups[groupID].threads.push(threadID)
    }

    return { addGroup, addUserToGroup, addThreadToGroup }

}
