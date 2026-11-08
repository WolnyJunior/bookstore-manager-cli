import { pool } from "../config/database";
import { Autor, NovoAutor } from "../models/Autor";

const COLUNAS = `id, nome, nacionalidade, data_nascimento`

export class AutorRepository {
    async criarAutor(dados: NovoAutor): Promise<Autor> {
        const resultadoCriarAutor = await pool.query<Autor>(
            `INSERT INTO autores (nome, nacionalidade, data_nascimento)
            VALUES ($1, $2, $3)
            RETURNING ${COLUNAS}`,
            [dados.nome, dados.nacionalidade, dados.data_nascimento]
        )
        const autor = resultadoCriarAutor.rows[0]
        if (!autor) {
            throw new Error("Falha ao criar autor: o banco não retornou o registro.")
        }
        return autor
    }

    async listarAutores(): Promise<Autor[]> {
        const resultadoListarAutores = await pool.query<Autor>(
            `SELECT ${COLUNAS} FROM autores ORDER BY id`
        )
        return resultadoListarAutores.rows
    }

    async buscarAutorPorId(id: number): Promise<Autor | null> {
        const resultadoBuscaAutorPorId = await pool.query<Autor>(
            `SELECT ${COLUNAS} FROM autores WHERE id=$1`, [id]
        )
        return resultadoBuscaAutorPorId.rows[0] ?? null
    }
    async atualizarAutores(id: number, dados: NovoAutor): Promise<Autor | null> {
        const resultadoAtualizarAutor = await pool.query<Autor>(
            `UPDATE autores
            SET nome = $1, nacionalidade = $2, data_nascimento = $3
            WHERE id = $4
            RETURNING ${COLUNAS}`,
            [dados.nome, dados.nacionalidade, dados.data_nascimento, id]
        )
        return resultadoAtualizarAutor.rows[0] ?? null
    }

    async deletarAutor(id: number): Promise<boolean> {
        const resultadoDeletarAutor = await pool.query(
            `DELETE FROM autores WHERE id = $1`, [id]
        )
        return (resultadoDeletarAutor.rowCount ?? 0) > 0
    }
}