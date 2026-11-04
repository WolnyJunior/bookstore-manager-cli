// Detalhe de um erro de validação: quel campo falhou e por quê
export interface DetalheErro {
    campo: string
    mensagem: string
}

// Erro esperado da aplicação: mensagem + status HTTP
// "extends Error" herda o comportamento do erro nativo do JS(stack trace, message)

export class AppError extends Error {
    public readonly statusCode: number
    public readonly detalhes: DetalheErro[] | undefined

    constructor(message: string, statusCode = 400, detalhes?: DetalheErro[]) {
        super(message) // chama o construtor do Error com a mensagem
        this.name = "AppError"
        this.statusCode = statusCode
        this.detalhes = detalhes
    }
}
