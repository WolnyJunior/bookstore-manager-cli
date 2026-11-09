import { RelatorioController } from "../controllers";
import { AppError } from "../utils/AppError";
import { perguntar } from "../utils/prompt";

export class RelatorioMenu {
    constructor(private readonly relatorioController: RelatorioController) { }

    async exibir(): Promise<void> {
        while (true) {
            console.log("\n=== RELATÓRIOS ===")
            console.log("1 - Resumo do acervo")
            console.log("2 - Livros mais emprestados")
            console.log("3 - Empréstimos atrasados")
            console.log("4 - Clientes mais ativos")
            console.log("5 - Livros por autor")
            console.log("0 - Voltar")

            const opcao = await perguntar("Escolha uma opção: ")
            if (opcao === "0") return
            await this.executarSeguro(opcao)
        }
    }

    private async executarSeguro(opcao: string): Promise<void> {
        try {
            await this.executar(opcao)
        } catch (erro) {
            if (erro instanceof AppError) {
                console.log(`\n ${erro.message}`)
            } else {
                console.error("\nErro inesperado:", erro)
            }
        }
    }

    private async executar(opcao: string): Promise<void> {
        switch (opcao) {
            case "1":
                return this.resumo()
            case "2":
                return this.livrosMaisEmprestados()
            case "3":
                return this.emprestimosAtrasados()
            case "4":
                return this.clientesMaisAtivos()
            case "5":
                return this.livrosPorAutor()
            default:
                console.log("Opção inválida")
                return
        }
    }

    private async resumo(): Promise<void> {
        const resumo = await this.relatorioController.resumoAcervo()
        console.log("\n--- Resumo do acervo ---")
        console.log(`Autores cadastrados:     ${resumo.autores}`)
        console.log(`Títulos (livros):        ${resumo.livros}`)
        console.log(`Exemplares no total:     ${resumo.exemplares}`)
        console.log(`Exemplares disponíveis:  ${resumo.exemplares_disponiveis}`)
        console.log(`Clientes cadastrados:    ${resumo.clientes}`)
        console.log(`Empréstimos ativos:      ${resumo.emprestimos_ativos}`)
        console.log(`Empréstimos atrasados:   ${resumo.emprestimos_atrasados}`)
    }

    private async livrosMaisEmprestados(): Promise<void> {
        const livros = await this.relatorioController.livrosMaisEmprestados()
        this.mostrarTabela(
            livros.map((livro) => ({
                Título: livro.titulo,
                Autor: livro.autor,
                Empréstimos: livro.total_emprestimos,
            })),
        )
    }

    private async emprestimosAtrasados(): Promise<void> {
        const atrasados = await this.relatorioController.emprestimosAtrasados()
        this.mostrarTabela(
            atrasados.map((item) => ({
                Empréstimo: item.id,
                Cliente: item.cliente,
                Livro: item.livro,
                Previsto: item.data_prevista_devolucao,
                "Dias de atraso": item.dias_atraso,
            })),
        )
    }

    private async clientesMaisAtivos(): Promise<void> {
        const clientes = await this.relatorioController.clientesMaisAtivos()
        this.mostrarTabela(
            clientes.map((item) => ({
                Cliente: item.cliente,
                "Total de empréstimos": item.total_emprestimos,
                Ativos: item.ativos,
            })),
        )
    }

    private async livrosPorAutor(): Promise<void> {
        const autores = await this.relatorioController.livrosPorAutor()
        this.mostrarTabela(
            autores.map((item) => ({
                Autor: item.autor,
                Livros: item.total_livros,
            })),
        )
    }

    private mostrarTabela(linhas: object[]): void {
        if (linhas.length === 0) {
            console.log("\nNenhum registro encontrado.")
            return
        }
        console.table(linhas)
    }
}