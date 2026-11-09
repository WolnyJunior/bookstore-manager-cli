export interface LivroMaisEmprestado {
    titulo: string
    autor: string
    total_emprestimos: number
}

export interface EmprestimoAtrasado {
    id: number
    cliente: string
    livro: string
    data_prevista_devolucao: string
    dias_atraso: number
}

export interface ClienteAtivo {
    cliente: string
    total_emprestimos: number
    ativos: number
}

export interface LivrosPorAutor {
    autor: string
    total_livros: number
}

export interface ResumoAcervo {
    autores: number
    livros: number
    exemplares: number
    exemplares_disponiveis: number
    clientes: number
    emprestimos_ativos: number
    emprestimos_atrasados: number
}
