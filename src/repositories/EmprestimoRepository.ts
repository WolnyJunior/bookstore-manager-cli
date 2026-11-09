import { executarEmTransacao, pool } from "../config/database"
import { Devolucao, Emprestimo, EmprestimoDetalhado } from "../models/Emprestimo"

const COLUNAS = `id, cliente_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao`

const SELECT_DETALHADO = `SELECT e.id, e.cliente_id, e.livro_id, e.data_emprestimo, 
        e.data_prevista_devolucao, e.data_devolucao,
        c.nome AS cliente_nome,
        l.titulo AS livro_titulo,
        CASE
            WHEN e.data_devolucao IS NOT NULL THEN 'Devolvido'
            WHEN e.data_prevista_devolucao < CURRENT_DATE THEN 'Atrasado'
            ELSE 'Ativo'
        END AS situacao
    FROM emprestimos e
    INNER JOIN clientes c
        ON c.id = e.cliente_id
    INNER JOIN livros l
        ON l.id = e.livro_id`

export class EmprestimoRepository {
    async registrarEmprestimo(
        clienteId: number,
        livroId: number,
        prazoDias: number,
    ): Promise<Emprestimo | null> {
        return executarEmTransacao(async (client) => {
            const estoque = await client.query(
                `UPDATE livros
                SET quantidade_disponivel = quantidade_disponivel -1
                WHERE id = $1 AND quantidade_disponivel > 0`,
                [livroId],
            )
            if ((estoque.rowCount ?? 0) === 0) return null

            const resultado = await client.query<Emprestimo>(
                `INSERT INTO emprestimos (cliente_id, livro_id, data_prevista_devolucao)
                VALUES ($1, $2, CURRENT_DATE + $3::integer)
                RETURNING ${COLUNAS}`,
                [clienteId, livroId, prazoDias],
            )

            const emprestimo = resultado.rows[0]
            if (!emprestimo) {
                throw new Error("Falha ao registrar empréstimo.")
            }
            return emprestimo
        })
    }
    async registrarDevolucao(id: number): Promise<Devolucao | null> {
        return executarEmTransacao(async (client) => {
            const resultado = await client.query<Devolucao>(
                `UPDATE emprestimos
                SET data_devolucao = CURRENT_DATE
                WHERE id = $1 AND data_devolucao IS NULL
                RETURNING ${COLUNAS},
                GREATEST(CURRENT_DATE - data_prevista_devolucao, 0) AS dias_atraso`,
                [id],
            )
            const devolucao = resultado.rows[0]
            if (!devolucao) return null

            await client.query(
                `UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1`,
                [devolucao.livro_id],
            )
            return devolucao
        })
    }

    async buscarEmprestimoPorId(id: number): Promise<Emprestimo | null> {
        const resultado = await pool.query<Emprestimo>(
            `SELECT ${COLUNAS} FROM emprestimos WHERE id = $1`,
            [id],
        )
        return resultado.rows[0] ?? null
    }

    async listarEmprestimos(): Promise<EmprestimoDetalhado[]> {
        const resultado = await pool.query<EmprestimoDetalhado>(
            `${SELECT_DETALHADO} ORDER BY e.data_emprestimo DESC, e.id DESC`,
        )
        return resultado.rows
    }

    async listarEmprestimosAtivos(): Promise<EmprestimoDetalhado[]> {
        const resultado = await pool.query<EmprestimoDetalhado>(
            `${SELECT_DETALHADO} WHERE e.data_devolucao IS NULL ORDER BY e.data_prevista_devolucao, e.id`,
        )
        return resultado.rows
    }

    async contarAtivosdoCliente(clienteId: number): Promise<number> {
        const resultado = await pool.query<{ total: number }>(
            `SELECT COUNT(*)::integer AS total
            FROM emprestimos
            WHERE cliente_id = $1 
                AND data_devolucao IS NULL`,
            [clienteId],
        )
        return resultado.rows[0]?.total ?? 0
    }
    async contarAtrasadosDoCliente(clienteId: number): Promise<number> {
        const resultado = await pool.query<{ total: number }>(
            `SELECT COUNT(*)::integer AS total
             FROM emprestimos
             WHERE cliente_id = $1
               AND data_devolucao IS NULL
               AND data_prevista_devolucao < CURRENT_DATE`,
            [clienteId],
        )
        return resultado.rows[0]?.total ?? 0
    }
}
