import { Devolucao, Emprestimo, EmprestimoDetalhado } from "../models/Emprestimo";
import { ClienteRepository } from "../repositories";
import { EmprestimoRepository } from "../repositories";
import { LivroRepository } from "../repositories";
import { AppError } from "../utils/AppError";

const PRAZO_DIAS = 14
const LIMITE_EMPRESTIMOS_ATIVOS = 3

export class EmprestimoService {
    constructor(
        private readonly emprestimoRepository: EmprestimoRepository,
        private readonly clienteRepository: ClienteRepository,
        private readonly livroRepository: LivroRepository
    ) { }

    async emprestar(clienteId: number, livroId: number): Promise<Emprestimo> {
        this.validarId(clienteId)
        this.validarId(livroId)

        const cliente = await this.clienteRepository.buscarClientePorId(clienteId)
        if (!cliente)
            throw new AppError("Cliente não encontrado.")

        const livro = await this.livroRepository.buscarLivroPorId(livroId)
        if (!livro)
            throw new AppError("Livro não encontrado.")

        // #regra: cliente com empréstimo atrasado, não pode fazer novo empréstimo
        if ((await this.emprestimoRepository.contarAtrasadosDoCliente(clienteId)) > 0) {
            throw new AppError("O cliente possui empréstimo atrasado, não pode fazer novo empréstimo.")
        }

        // #regra: limite de empréstimos ativos por cliente.
        if ((await this.emprestimoRepository.contarAtivosdoCliente(clienteId)) >= LIMITE_EMPRESTIMOS_ATIVOS) {
            throw new AppError(`O cliente já possui 3 empréstimos ativos.`)
        }

        if (livro.quantidade_disponivel < 1) {
            throw new AppError("livro sem exemplares disponíveis.")
        }

        const emprestimo = await this.emprestimoRepository.registrarEmprestimo(clienteId, livroId, PRAZO_DIAS)
        if (!emprestimo)
            throw new AppError("Não foi possível concluir o empréstimo, não possui exemplares disponiveis.")
        return emprestimo
    }

    async devolver(id: number): Promise<Devolucao> {
        this.validarId(id)

        const emprestimo = await this.emprestimoRepository.buscarEmprestimoPorId(id)
        if (!emprestimo)
            throw new AppError("Empréstimo não encontrado.")
        if (emprestimo.data_devolucao !== null)
            throw new AppError("Esse empréstimo já foi devolvido.")

        const devolucao = await this.emprestimoRepository.registrarDevolucao(id)
        if (!devolucao)
            throw new AppError("Essa devolução já foi finalizada.")
        return devolucao
    }

    async listar(): Promise<EmprestimoDetalhado[]> {
        return this.emprestimoRepository.listarEmprestimos()
    }

    async listarAtivos(): Promise<EmprestimoDetalhado[]> {
        return this.emprestimoRepository.listarEmprestimosAtivos()
    }

    private validarId(id: number): void {
        if (!Number.isInteger(id) || id <= 0)
            throw new AppError(` ID inválido.`)
    }
}