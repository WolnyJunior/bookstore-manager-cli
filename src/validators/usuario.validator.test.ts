import { describe, expect, it } from "vitest"
import { AppError } from "../utils/AppError"
import { validarAtualizacao, validarCadastro } from "./usuario.validator"

// Executa uma função que DEVE falhar e devolve o AppError lançado, para inspecionarmos
function capturaErro(fn: () => unknown): AppError {
    try {
        fn()
    } catch (erro) {
        if (erro instanceof AppError) return erro
        throw erro
    }
    throw new Error("A função deveria ter lançado um AppError")
}

describe("validarCadastro", () => {
    it("normaliza nome e e-mail de um cadastro válido", () => {
        const dados = validarCadastro({
            nome: " Sorin ",
            email: " sorin@Teste.com ",
            senha: "12345678",
        })

        expect(dados).toEqual({ nome: "Sorin", email: "sorin@teste.com", senha: "12345678" })
    })

    it("devolve todos os erros de uma vez", () => {
        const erro = capturaErro(() => validarCadastro({}))

        expect(erro.statusCode).toBe(400)
        expect(erro.detalhes?.map((d) => d.campo)).toEqual(["nome", "email", "senha"])
    })

    it("rejeita e-mail inválido e senha curta", () => {
        const erro = capturaErro(() =>
            validarCadastro({ nome: "Itachi", email: "abc", senha: "123" }),
        )

        expect(erro.detalhes?.map((d) => d.campo)).toEqual(["email", "senha"])
    })

    it("não aceita campos que não são texto", () => {
        const erro = capturaErro(() => validarCadastro({ nome: 123, email: null, senha: [] }))

        expect(erro.detalhes?.map((d) => d.campo)).toEqual(["nome", "email", "senha"])
    })
})

describe("validarAtualizacao", () => {
    it("exige ao menos um campo", () => {
        const erro = capturaErro(() => validarAtualizacao({}))

        expect(erro.statusCode).toBe(400)
    })

    it("devolve apenas os campos enviados", () => {
        expect(validarAtualizacao({ nome: "BatmaMandu" })).toEqual({ nome: "BatmaMandu" })
    })

    it("aceita um perfil válido", () => {
        expect(validarAtualizacao({ perfil: "admin" })).toEqual({ perfil: "admin" })
    })

    it("rejeita um perfil desconhecido", () => {
        const erro = capturaErro(() => validarAtualizacao({ perfil: "dono" }))

        expect(erro.detalhes?.map((d) => d.campo)).toEqual(["perfil"])
    })
})
