import { Pool, PoolClient, types } from "pg"
import { env } from "./env"

// converter DATE em texto data '2026-11-07'
types.setTypeParser(1082, (valor) => valor)

export const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
})

export async function testConnection(): Promise<void> {
    await pool.query("SELECT 1")
}

export async function executarEmTransacao<T>(acao: (client: PoolClient) => Promise<T>) {

    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        const resultado = await acao(client)
        await client.query("COMMIT")
        return resultado
    } catch (erro) {
        await client.query("ROLLBACK")
        throw erro
    } finally {
        client.release()
    }
}
