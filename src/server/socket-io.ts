import { Socket as BaseSocket,  } from 'socket.io'
import { Handshake } from 'socket.io/dist/socket';


export interface ExtendedHandshake extends Handshake {
    auth: {
        username: string
    }
}

export interface ExtendedSocket extends BaseSocket {
    username: string
    handshake: ExtendedHandshake
}

export * from 'socket.io'