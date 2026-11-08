import { pool } from "../config/database";
import { Cliente, NovoCliente } from "../models/Cliente";

const COLUNAS = `id, nome, email, telefone, data_cadastro`

export class ClienteRepository {
    async criarCliente(dados: NovoCliente): Promise<Cliente> {
        const resultado = await pool.query<Cliente>(
            `INSERT INTO clientes(nome, email, telefone)
            VALUES($1, $2, $3)
            RETURNING ${COLUNAS}`,
            [dados.nome, dados.email, dados.telefone]
        )
        const cliente = resultado.rows[0]
        if (!cliente) {
            throw new Error("Falha ao criar novo cliente.")
        }
        return cliente
    }
    async listarClientes(): Promise<Cliente[]> {
        const resultado = await pool.query<Cliente>(`SELECT ${COLUNAS} FROM clientes ORDER BY id`)
        return resultado.rows
    }

    async buscarClientePorId(id: number): Promise<Cliente | null> {
        const resultado = await pool.query<Cliente>(`SELECT ${COLUNAS} FROM clientes WHERE id = $1`, [id])
        return resultado.rows[0] ?? null
    }

    async atualizarCliente(id: number, dados: NovoCliente): Promise<Cliente | null> {
        const resultado = await pool.query<Cliente>(
            `UPDATE clientes
            SET nome = $1, email = $2, telefone = $3
            WHERE id = $4
            RETURNING ${COLUNAS}`,
            [dados.nome, dados.email, dados.telefone]
        )
        return resultado.rows[0] ?? null
    }
    async removerCliente(id: number): Promise<boolean> {
        const resultado = await pool.query(`DELETE FROM clientes WHERE id = $1`, [1])
        return (resultado.rowCount ?? 0) > 0
    }
}