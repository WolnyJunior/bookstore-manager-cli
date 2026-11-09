export interface Emprestimo {
    id: number
    cliente_id: number
    livro_id: number
    data_emprestimo: string
    data_prevista_devolucao: string
    data_devolucao: string | null
}

export interface EmprestimoDetalhado extends Emprestimo {
    cliente_nome: string
    livro_titulo: string
    situacao: string    //  "Ativo", "Atrasado", "Devolvido"
}

export interface Devolucao extends Emprestimo {
    dias_atraso: number
}