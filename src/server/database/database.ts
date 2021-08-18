import { Pool } from 'pg'

function parseDatabaseUrl() {
    try {
        const DATABASE_URL = process.env.DATABASE_URL as string
        const [credentials, andTheRest] = DATABASE_URL
            .slice(DATABASE_URL.indexOf('://') + 3)
            .split('@')
        const [user, password] = credentials.split(':')
        const [host, andMore] = andTheRest.split(':')
        const [port, database] = andMore.split('/')
        return {
            user,
            password,
            host,
            database,
            port: Number(port)
        }
    } catch (error) {
        throw error
    }
}

export default new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ...parseDatabaseUrl()
})
