import { AppError, type DetalheErro } from "../utils/AppError"

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const campoObrigatório = "Campo obrigatório."
const numeroMaximoCaracteresNome = "O nome deve conter no máximo 100 caracteres."
const numeroMaximoCaracteresEmail = "O email deve conter no máximo 150 caracteres."

// Converte qualquer valor em texto limpo, o que não for texto vira ""
function limpaTexto(valor: unknown): string {
    return typeof valor === "string" ? valor.trim() : ""
}

// Regras compartilhadas entre cadastro e atualização.
// Recebem o valor já limpo e acrescentam os problemas encontrados à lista de erros.
function checarNome(nome: string, erros: DetalheErro[]): void {
    if (!nome) {
        erros.push({ campo: "nome", mensagem: campoObrigatório })
    } else if (nome.length > 100) {
        erros.push({ campo: "nome", mensagem: numeroMaximoCaracteresNome })
    }
}

function checarEmail(email: string, erros: DetalheErro[]): void {
    if (!email) {
        erros.push({ campo: "email", mensagem: campoObrigatório })
    } else if (!REGEX_EMAIL.test(email)) {
        erros.push({ campo: "email", mensagem: "E-mail inválido." })
    } else if (email.length > 150) {
        erros.push({ campo: "email", mensagem: numeroMaximoCaracteresEmail })
    }
}

// ---- CADASTRO -----

export interface DadosCadastro {
    nome: string
    email: string
    senha: string
}

//"dados" vem direto do corpo da requisição: pode ter qualquer formato, por isso é "unknown"
export function validarCadastro(dados: Record<string, unknown>): DadosCadastro {
    const erros: DetalheErro[] = []

    // Se o campo não for texto, vira "" e cai no "obrigatório". Também já limpamos os dados.
    const nome = limpaTexto(dados.nome)
    const email = limpaTexto(dados.email).toLowerCase()
    const senha = typeof dados.senha === "string" ? dados.senha.trim() : ""

    checarNome(nome, erros)
    checarEmail(email, erros)

    if (!senha) {
        erros.push({ campo: "senha", mensagem: "Senha é obrigatória." })
    } else if (senha.length < 8) {
        erros.push({ campo: "senha", mensagem: "A senha deve conter pelo menos 8 caracteres" })
    } else if (Buffer.byteLength(senha, "utf-8") > 72) {
        erros.push({ campo: "senha", mensagem: "A senha deve ter no máximo 72 caracteres." })
    }

    //Só lança depois de checar todos os campos: o cliente recebe uma lista completa
    if (erros.length > 0) {
        throw new AppError("Dados inválidos", 400, erros)
    }
    return { nome, email, senha }
}

// -------- Atualização -----------

// Todos os campos são opcionais: só entra no objeto o que o cliente enviou
export interface DadosAtualizacao {
    nome?: string
    email?: string
    perfil?: "usuario" | "admin"
}

export function validarAtualizacao(dados: Record<string, unknown>): DadosAtualizacao {
    //Corpo sem nenhum campo conhecido: não há o que atualizar
    if (dados.nome === undefined && dados.email === undefined && dados.perfil === undefined) {
        throw new AppError("Dados inválidos", 400, [
            {
                campo: "corpo",
                mensagem: "Informe ao menos um campo para atualizar: nome, email, perfil",
            },
        ])
    }

    const erros: DetalheErro[] = []
    const resultado: DadosAtualizacao = {}

    // "undefined" = o cliente não enviou o campo(ignorar)
    // Já " " = enviou vazio(erro de "campo obrigatório")
    if (dados.nome !== undefined) {
        const nome = limpaTexto(dados.nome)
        checarNome(nome, erros)
        resultado.nome = nome
    }

    if (dados.email !== undefined) {
        const email = limpaTexto(dados.email).toLowerCase()
        checarEmail(email, erros)
        resultado.email = email
    }

    if (dados.perfil !== undefined) {
        const perfil = dados.perfil
        if (perfil === "usuario" || perfil === "admin") {
            resultado.perfil = perfil
        } else {
            erros.push({ campo: "perfil", mensagem: "Perfil deve ser 'usuario' ou 'admin'" })
        }
    }

    if (erros.length > 0) {
        throw new AppError("Dados Inválidos", 400, erros)
    }

    return resultado
}
