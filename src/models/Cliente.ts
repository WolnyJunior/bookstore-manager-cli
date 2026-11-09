export interface NovoCliente {
    nome: string
    email: string
    telefone: string
}

export interface Cliente extends NovoCliente {
    id: number
    data_cadastro: string
}
