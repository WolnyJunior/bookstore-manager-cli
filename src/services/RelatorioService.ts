import { ClienteAtivo, EmprestimoAtrasado, LivroMaisEmprestado, LivrosPorAutor, ResumoAcervo } from "../models/Relatorio";
import { RelatorioRepository } from "../repositories/RelatorioRepository";

export class RelatorioService {
    constructor(private readonly relatorioRepository: RelatorioRepository) { }

    resumoAcervo(): Promise<ResumoAcervo> {
        return this.relatorioRepository.resumoAcervo()
    }

    livrosMaisEmprestados(): Promise<LivroMaisEmprestado[]> {
        return this.relatorioRepository.livrosMaisEmprestados()
    }

    emprestimosAtrasados(): Promise<EmprestimoAtrasado[]> {
        return this.relatorioRepository.emprestimosAtrasados()
    }

    clientesMaisAtivos(): Promise<ClienteAtivo[]> {
        return this.relatorioRepository.clientesMaisAtivos()
    }

    livrosPorAutor(): Promise<LivrosPorAutor[]> {
        return this.relatorioRepository.livrosPorAutor()
    }
}