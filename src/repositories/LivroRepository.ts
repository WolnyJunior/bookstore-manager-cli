import { pool } from "../config/database"
import { Livro, LivroDetalhado, NovoLivro } from "../models/Livro"

const COLUNAS = `id, titulo, genero, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id`

const SELECT_DETALHADO = `
    SELECT  l.id, l.titulo, l.genero, l.isbn, l.ano_publicacao, l.quantidade_total,
            l.quantidade_disponivel, l.autor_id, a.nome as autor_nome
    FROM livros l
    INNER JOIN autores a
        ON a.id = l.autor_id    `

export class LivroRepository {
    async criarLivro(dados: NovoLivro): Promise<Livro> {
        const resultado = await pool.query<Livro>(
            `INSERT INTO livros (titulo, genero, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
            VALUES($1, $2, $3, $4, $5, $5, $6)
            RETURNING ${COLUNAS}`,
            [
                dados.titulo,
                dados.genero,
                dados.isbn,
                dados.ano_publicacao,
                dados.quantidade_total,
                dados.autor_id,
            ],
        )

        const livro = resultado.rows[0]
        if (!livro) {
            throw new Error("Falha ao criar livro: o banco não retornou o registro")
        }

        return livro
    }

    async listarLivros(): Promise<LivroDetalhado[]> {
        const resultado = await pool.query<LivroDetalhado>(`${SELECT_DETALHADO} ORDER BY l.id`)
        return resultado.rows
    }

    async buscarLivroPorId(id: number): Promise<LivroDetalhado | null> {
        const resultado = await pool.query<LivroDetalhado>(`${SELECT_DETALHADO} WHERE l.id = $1`, [
            id,
        ])
        return resultado.rows[0] ?? null
    }

    async atualizarLivro(id: number, dados: NovoLivro): Promise<Livro | null> {
        const resultado = await pool.query<Livro>(
            `UPDATE livros
            SET titulo = $1,
                genero = $2,
                isbn = $3,
                ano_publicacao = $4,
                quantidade_disponivel = $5::integer - (quantidade_total - quantidade_disponivel),
                quantidade_total = $5,
                autor_id = $6
            WHERE id = $7
            RETURNING ${COLUNAS}`,
            [
                dados.titulo,
                dados.genero,
                dados.isbn,
                dados.ano_publicacao,
                dados.quantidade_total,
                dados.autor_id,
                id,
            ],
        )
        return resultado.rows[0] ?? null
    }

    async removerLivro(id: number): Promise<boolean> {
        const resultado = await pool.query(`DELETE FROM livros WHERE id = $1`, [id])
        return (resultado.rowCount ?? 0) > 0
    }
}
