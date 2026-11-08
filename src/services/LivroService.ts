import { Livro, LivroDetalhado, NovoLivro } from "../models/Livro";
import { LivroRepository } from "../repositories/LivroRepository";
import { AppError } from "../utils/AppError";
import { codigoErroBanco, ERRO_CHAVE_ESTRANGEIRA, ERRO_CHECK, ERRO_UNIQUE } from "../utils/erroBanco";

export class LivroService {
    constructor(private readonly livroRepository: LivroRepository) { }

    async cadastrarLivro(dados: NovoLivro): Promise<Livro> {
        const cadastrarLivro = this.validar(dados)
        try {
            return await this.livroRepository.criarLivro(cadastrarLivro)
        } catch (erro) {
            throw this.traduziErro(erro)
        }
    }

    async listarLivros(): Promise<LivroDetalhado[]> {
        return this.livroRepository.listarLivros()
    }

    async buscarPorId(id: number): Promise<LivroDetalhado> {
        this.validarId(id)
        const livro = await this.livroRepository.buscarLivroPorId(id)
        if (!livro)
            throw new AppError("ID do livro não encontrado para busca.")
        return livro
    }

    async atualizarLivro(id: number, dados: NovoLivro): Promise<Livro> {
        this.validarId(id)
        const livroAtualizado = this.validar(dados)
        try {
            const novoLivro = await this.livroRepository.atualizarLivro(id, livroAtualizado)
            if (!novoLivro)
                throw new AppError("ID do livro não encontrado para atualização.")
            return novoLivro
        } catch (erro) {
            throw this.traduziErro(erro)
        }
    }

    async deletarLivro(id: number): Promise<void> {
        this.validarId(id)
        try {
            const removido = await this.livroRepository.removerLivro(id)
            if (!removido)
                throw new AppError("ID do livro não encontrado para remoção.")
        } catch (erro) {
            if (codigoErroBanco(erro) === ERRO_CHAVE_ESTRANGEIRA) {
                throw new AppError("Não é possível remover: livro possui empréstimo regsitrado.")
            }
            throw erro
        }
    }
    private validar(dados: NovoLivro): NovoLivro {
        const titulo = dados.titulo.trim()
        if (!titulo)
            throw new AppError("O título é obrigatório.")
        if (titulo.length > 150)
            throw new AppError("O título deve conter no máximo 150 caracteres.")

        const genero = dados.genero.trim()
        if (!genero)
            throw new AppError("O gênero é obrigatório.")

        const isbn = dados.isbn.trim()
        if (!isbn)
            throw new AppError("O ISBN é obrigatório.")
        if (isbn.length > 20)
            throw new AppError("O ISBN deve conter no máximo 20 caracteres")

        const ano = dados.ano_publicacao
        const anoAtual = new Date().getFullYear()
        if (ano !== null && (!Number.isInteger(ano) || ano < 1 || ano > anoAtual)) {
            throw new AppError(`Ano de publicação inválido. Use um ano entre 1 e ${anoAtual}`)
        }
        if (!Number.isInteger(dados.quantidade_total) || dados.quantidade_total < 1) {
            throw new AppError("A quantidade deve ser um número inteiro maior que zero.")
        }

        this.validarId(dados.autor_id, "ID do autor")

        return {
            titulo,
            genero,
            isbn,
            ano_publicacao: ano,
            quantidade_total: dados.quantidade_total,
            autor_id: dados.autor_id
        }
    }

    private traduziErro(erro: unknown): unknown {
        switch (codigoErroBanco(erro)) {
            case ERRO_UNIQUE:
                return new AppError("Já existe um livro com este ISBN")
            case ERRO_CHAVE_ESTRANGEIRA:
                return new AppError("Autor não encontrado")
            case ERRO_CHECK:
                return new AppError("A quantidade total não pode ser menor que o número de exemplares emprestado.")
            default:
                return erro
        }
    }

    private validarId(id: number, rotulo = "ID"): void {
        if (!Number.isInteger(id) || id <= 0)
            throw new AppError(`${rotulo} inválido`)
    }
}
