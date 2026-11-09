export interface NovoLivro {
    titulo: string
    genero: string
    isbn: string
    ano_publicacao: number | null
    quantidade_total: number
    autor_id: number
}

export interface Livro extends NovoLivro {
    id: number
    quantidade_disponivel: number
}

export interface LivroDetalhado extends Livro {
    autor_nome: string
}
