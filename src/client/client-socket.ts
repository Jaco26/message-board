import { io } from 'socket.io-client'
import { onDeactivated, Ref } from 'vue'

import { ClientUser, User } from '@/types'


const sortClientUsersByUsername = (users: ClientUser[]) => (
    users.sort((a, b) => {
        if (a.isSelf) return 1
        if (b.isSelf) return -1
        if (a.username < b.username) return -1
        if (a.username > b.username) return 1
        return 0
    }
))

const createClientUser = (user: User): ClientUser  => ({
    ...user,
    hasNewMessages: false,
    messages: [],
    connected: true,
    isSelf: 
})

 
export interface Params {
    usernameAlreadySelected: Ref<boolean>
    users: Ref<ClientUser[]>
}

export const createSocket = (params: Params) => {

    const socket = io('http://localhost:3500', { autoConnect: false })

    socket.onAny((event, ...args) => {
        console.log('[socket.onAny]', event, args)
    })

    socket.on('connect_error', err => {
        if (err.message == 'invalid username') {
            params.usernameAlreadySelected.value = false
        }
    })

    socket.on('users', (users: User[]) => {
        params.users.value = sortClientUsersByUsername(
            users.map(user => ({
                ...user,
                connected: true,
                isSelf: user.userID === socket.id
            }))
        )
    })

    socket.on('user connected', (user: User) => {
        user.
    })

    onDeactivated(() => {
        socket.off('connection_error')
    })

    return {
        onUsernameSelection(username: string) {
            params.usernameAlreadySelected.value = true
            socket.auth = { username }
            socket.connect()
        }
    }
}
