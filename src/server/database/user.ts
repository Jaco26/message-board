import uuid from 'uuid'

import { User, State } from './types'

import { useUtils } from './utils'

export const useUsers = (state: State) => {

    const { exists } = useUtils(state)

    const _usernameExists = (username: string) => exists('users', 'username', username)

    const _createUser = (username: string): User => ({
        username,
        id: uuid.v4(),
        groups: []
    })

    const addUser = (username: string) => {
        if (_usernameExists(username)) {
            throw new Error('[addUser] invalid username')
        }
        const user = _createUser(username)
        state.users[user.id] = user
        return user
    }

    return { addUser }

}