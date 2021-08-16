import uuid from 'uuid'
import { State, Message, Thread } from './types'
import { useUtils } from './utils'


export const useThreads = (state: State) => {

    const { idExists } = useUtils(state)

    const _createThread = (groupID: string, root: Message): Thread => ({
        groupID,
        root,
        id: uuid.v4(),
    })

    const addThread = (groupID: string, message: Message) => {
        if (!idExists('groups', groupID)) {
            throw new Error('[addThread] invalid groupID')
        }
        const thread = _createThread(groupID, message)
        state.threads[thread.id] = thread
        return thread
    }

    return { addThread }

}
