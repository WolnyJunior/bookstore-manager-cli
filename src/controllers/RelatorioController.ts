import { ClienteAtivo, EmprestimoAtrasado, LivroMaisEmprestado, LivrosPorAutor, ResumoAcervo } from "../models/Relatorio";
import { RelatorioService } from "../services";

export class RelatorioController {
    constructor(private readonly relatorioService: RelatorioService) { }

    resumoAcervo(): Promise<ResumoAcervo> {
        return this.relatorioService.resumoAcervo()
    }

    livrosMaisEmprestados(): Promise<LivroMaisEmprestado[]> {
        return this.relatorioService.livrosMaisEmprestados()
    }

    emprestimosAtrasados(): Promise<EmprestimoAtrasado[]> {
        return this.relatorioService.emprestimosAtrasados()
    }

    clientesMaisAtivos(): Promise<ClienteAtivo[]> {
        return this.relatorioService.clientesMaisAtivos()
    }

    livrosPorAutor(): Promise<LivrosPorAutor[]> {
        return this.relatorioService.livrosPorAutor()
    }
}