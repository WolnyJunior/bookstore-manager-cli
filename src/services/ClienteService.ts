import { Cliente, NovoCliente } from "../models/Cliente"
import { ClienteRepository } from "../repositories"
import { AppError } from "../utils/AppError"
import {
    codigoErroBanco,
    ERRO_CHAVE_ESTRANGEIRA,
    ERRO_UNIQUE,
} from "../utils/erroBanco"

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class ClienteService {
    constructor(private readonly clienteRepository: ClienteRepository) { }

    async cadastrar(dados: NovoCliente): Promise<Cliente> {
        const cliente = this.validar(dados)
        try {
            return await this.clienteRepository.criarCliente(cliente)
        } catch (erro) {
            throw this.traduzirErro(erro)
        }
    }

    async listar(): Promise<Cliente[]> {
        return this.clienteRepository.listarClientes()
    }

    async buscarPorId(id: number): Promise<Cliente> {
        this.validarId(id)
        const cliente = await this.clienteRepository.buscarClientePorId(id)
        if (!cliente) throw new AppError("ID do cliente não encontrado.")
        return cliente
    }
    async atualizar(id: number, dados: NovoCliente): Promise<Cliente> {
        this.validarId(id)
        const novosDados = this.validar(dados)
        try {
            const cliente = await this.clienteRepository.atualizarCliente(id, novosDados)
            if (!cliente) throw new AppError("ID de cliente não encontrado.")
            return cliente
        } catch (erro) {
            throw this.traduzirErro(erro)
        }
    }
    async remover(id: number): Promise<void> {
        this.validarId(id)
        try {
            const removido = await this.clienteRepository.removerCliente(id)
            if (!removido) throw new AppError("ID do cliente não encontrado.")
        } catch (erro) {
            if (codigoErroBanco(erro) === ERRO_CHAVE_ESTRANGEIRA) {
                throw new AppError("Não é possível remover: o cliente possui empréstimos ativos.")
            }
            throw erro
        }
    }

    private validar(dados: NovoCliente): NovoCliente {
        const nome = dados.nome.trim()
        if (!nome) throw new AppError("O nome do cliente é obrigatório.")
        if (nome.length > 100) throw new AppError("O nome deve ter no máximo 100 caracteres.")

        const email = dados.email.trim().toLowerCase()
        if (!email) throw new AppError("O e-mail é obrigatório.")
        if (email.length > 100) throw new AppError("O e-mail deve ter no máximo 100 caracteres.")
        if (!REGEX_EMAIL.test(email)) throw new AppError("E-mail inválido.")

        const telefone = dados.telefone?.trim()
        if (telefone && telefone.length > 20) {
            throw new AppError("O telefone deve ter no máximo 20 caracteres.")
        }

        return { nome, email, telefone }
    }

    private traduzirErro(erro: unknown): unknown {
        if (codigoErroBanco(erro) === ERRO_UNIQUE) {
            return new AppError("Já existe um cliente com este e-mail.")
        }
        return erro
    }

    private validarId(id: number): void {
        if (!Number.isInteger(id) || id <= 0)
            throw new AppError(`ID inválido`)
    }
}
