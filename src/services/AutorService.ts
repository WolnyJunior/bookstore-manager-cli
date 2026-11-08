import { Autor, NovoAutor } from "../models/Autor"
import { AutorRepository } from "../repositories/AutorRepository"
import { AppError } from "../utils/AppError"

const ERRO_CHAVE_ESTRANGEIRA = "23503"

function violouChaveEstrangeira(erro: unknown): boolean {
    return (
        typeof erro === "object" &&
        erro !== null &&
        "code" in erro &&
        erro.code === ERRO_CHAVE_ESTRANGEIRA
    )
}

export class AutorService {
    constructor(private readonly repository: AutorRepository) {}

    async cadastrar(dados: NovoAutor): Promise<Autor> {
        return this.repository.criarAutor(this.validar(dados))
    }

    async listar(): Promise<Autor[]> {
        return this.repository.listarAutores()
    }

    async buscarPorId(id: number): Promise<Autor> {
        this.validarId(id)
        const autor = await this.repository.buscarAutorPorId(id)
        if (!autor) throw new AppError("Autor não encontrado")
        return autor
    }
    async atualizar(id: number, dados: NovoAutor): Promise<Autor> {
        this.validarId(id)
        const autor = await this.repository.atualizarAutores(id, this.validar(dados))
        if (!autor) throw new AppError("Autor não encontrado")
        return autor
    }
    async remover(id: number): Promise<void> {
        this.validarId(id)
        try {
            const removido = await this.repository.deletarAutor(id)
            if (!removido) throw new AppError("Autor não encontrado.")
        } catch (erro) {
            if (violouChaveEstrangeira(erro)) {
                throw new AppError("Não é possível remover: o autor possui livros cadastrados")
            }
            throw erro
        }
    }
    private validar(dados: NovoAutor): NovoAutor {
        const nome = dados.nome.trim()
        if (!nome) throw new AppError("O nome do autor é obrigatório.")
        if (nome.length > 100) throw new AppError("O nome deve ter no máximo 100 caracteres.")

        const nacionalidade = dados.nacionalidade?.trim() || null
        if (nacionalidade && nacionalidade.length > 50) {
            throw new AppError("A nacionalidade deve ter no máximo 50 caracteres.")
        }

        const data_nascimento = dados.data_nascimento?.trim() || null
        if (data_nascimento) this.validarData(data_nascimento)

        return { nome, nacionalidade, data_nascimento }
    }

    private validarData(valor: string): void {
        const mensagemDataInvalida = "Data Inválida. Use o formato AAA-MM-DD, com uma data real."
        //Regex: 4 dígitos, hífen 2 dígitos, hífen 2 dígitos
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) throw new AppError(mensagemDataInvalida)

        const dataValida = new Date(valor)
        if (Number.isNaN(dataValida.getTime()) || dataValida.toISOString().slice(0, 10) !== valor)
            throw new AppError(mensagemDataInvalida)

        const hoje = new Date().toISOString().slice(0, 10)
        if (valor > hoje) throw new AppError("A data de nascimento não pode estar no futuro.")
    }

    private validarId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) throw new AppError("ID inválido.")
    }
}
