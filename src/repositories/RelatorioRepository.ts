import { pool } from "../config/database"
import {
    ClienteAtivo,
    EmprestimoAtrasado,
    LivroMaisEmprestado,
    LivrosPorAutor,
    ResumoAcervo,
} from "../models/Relatorio"

export class RelatorioRepository {
    async livrosMaisEmprestados(): Promise<LivroMaisEmprestado[]> {
        const resultado = await pool.query<LivroMaisEmprestado>(
            `SELECT l.titulo, a.nome AS autor, COUNT(e.id)::integer AS total_emprestimos
             FROM livros l
             INNER JOIN autores a
                ON a.id = l.autor_id
             INNER JOIN emprestimos e
                ON e.livro_id = l.id
             GROUP BY l.id, l.titulo, a.nome
             ORDER BY total_emprestimos DESC, l.titulo
             LIMIT 5`,
        )
        return resultado.rows
    }

    async emprestimosAtrasados(): Promise<EmprestimoAtrasado[]> {
        const resultado = await pool.query<EmprestimoAtrasado>(
            `SELECT e.id, c.nome AS cliente, c.telefone, l.titulo AS livro,
                    e.data_prevista_devolucao,
                    (CURRENT_DATE - e.data_prevista_devolucao) AS dias_atraso
             FROM emprestimos e
             INNER JOIN clientes c
                ON c.id = e.cliente_id
             INNER JOIN livros l
                ON l.id = e.livro_id
             WHERE e.data_devolucao IS NULL
               AND e.data_prevista_devolucao < CURRENT_DATE
             ORDER BY dias_atraso DESC, e.id`,
        )
        return resultado.rows
    }

    async clientesMaisAtivos(): Promise<ClienteAtivo[]> {
        const resultado = await pool.query<ClienteAtivo>(
            `SELECT c.nome AS cliente,
                    COUNT(e.id)::integer AS total_emprestimos,
                    (COUNT(e.id) FILTER (WHERE e.data_devolucao IS NULL))::integer AS ativos
             FROM clientes c
             LEFT JOIN emprestimos e
                ON e.cliente_id = c.id
             GROUP BY c.id, c.nome
             ORDER BY total_emprestimos DESC, c.nome`,
        )
        return resultado.rows
    }

    async livrosPorAutor(): Promise<LivrosPorAutor[]> {
        const resultado = await pool.query<LivrosPorAutor>(
            `SELECT a.nome AS autor, COUNT(l.id)::integer AS total_livros
             FROM autores a
             LEFT JOIN livros l
                ON l.autor_id = a.id
             GROUP BY a.id, a.nome
             ORDER BY total_livros DESC, a.nome`,
        )
        return resultado.rows
    }

    async resumoAcervo(): Promise<ResumoAcervo> {
        const resultado = await pool.query<ResumoAcervo>(
            `SELECT
                 (SELECT COUNT(*) FROM autores)::integer AS autores,
                 (SELECT COUNT(*) FROM livros)::integer AS livros,
                 (SELECT COALESCE(SUM(quantidade_total), 0) FROM livros)::integer AS exemplares,
                 (SELECT COALESCE(SUM(quantidade_disponivel), 0) FROM livros)::integer AS exemplares_disponiveis,
                 (SELECT COUNT(*) FROM clientes)::integer AS clientes,
                 (SELECT COUNT(*) FROM emprestimos WHERE data_devolucao IS NULL)::integer AS emprestimos_ativos,
                 (SELECT COUNT(*) FROM emprestimos
                   WHERE data_devolucao IS NULL AND data_prevista_devolucao < CURRENT_DATE)::integer AS emprestimos_atrasados`,
        )

        const resumo = resultado.rows[0]
        if (!resumo) {
            throw new Error("Falha ao gerar o resumo do acervo.")
        }
        return resumo
    }
}
