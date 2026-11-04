import { AppError, type DetalheErro } from "../utils/AppError"

export interface DadosLogin {
    email: string
    senha: string
}

export function validarLogin(dados: Record<string, unknown>): DadosLogin {
    const erros: DetalheErro[] = []

    const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : ""
    const senha = typeof dados.senha === "string" ? dados.senha : ""

    if (!email) erros.push({ campo: "email", mensagem: "E-mail é obrigarótio." })
    if (!senha) erros.push({ campo: "senha", mensagem: "Senha é obrigarótia." })

    if (erros.length > 0) {
        throw new AppError("Dados inválidos.", 400, erros)
    }

    return { email, senha }
}
