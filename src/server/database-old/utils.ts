import { State } from './types'

export const useUtils = (state: State) => {

    const _getTableKeys = (table: keyof State) => Object.keys(state[table])

    const _getTableValues = (table: keyof State) => Object.values(state[table])

    const exists = <T extends keyof State, K extends keyof State[T]>(table: T, key: K, value: string) => (
        _getTableValues(table).some(x => x[key] === value)
    )

    const idExists= (table: keyof State, id: string) => (
        _getTableKeys(table).some(key => key === id)
    )

    return { exists, idExists }

}