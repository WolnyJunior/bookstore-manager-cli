import { EmprestimoController } from "../controllers";
import { EmprestimoDetalhado } from "../models/Emprestimo";
import { AppError } from "../utils/AppError";
import { perguntar } from "../utils/prompt";

export class EmprestimoMenu {
    constructor(private readonly emprestimoController: EmprestimoController) { }

    async exibirMenuEmprestimo(): Promise<void> {
        while (true) {
            console.log("\n=== EMPRÉSTIMOS ===")
            console.log("1 - Registrar empréstimo")
            console.log("2 - Registrar devolução")
            console.log("3 - Listar todos os empréstimos")
            console.log("4 - Listar empréstimos ativos")
            console.log("0 - Voltar")

            const opcao = await perguntar("Escolha uma opção")
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
                return this.emprestar()
            case "2":
                return this.devolver()
            case "3":
                return this.listar()
            case "4":
                return this.listarAtivos()
            default:
                console.log("Opção inválida")
                return
        }
    }

    private async emprestar(): Promise<void> {
        const clienteId = await perguntar("ID do cliente: ")
        const livroId = await perguntar("ID do livro: ")

        const emprestimo = await this.emprestimoController.emprestar(clienteId, livroId)
        console.log(`\nEmpréstimo registrado:
                     \nID: ${emprestimo.id}
                     \nData_Emprestimo: ${emprestimo.data_emprestimo}
                     \nData_Devolução: ${emprestimo.data_prevista_devolucao}`)
    }

    private async devolver(): Promise<void> {
        const id = await perguntar("ID do empréstimo: ")

        const devolucao = await this.emprestimoController.devolver(id)
        console.log("\nDevolução registrada.")
        if (devolucao.dias_atraso > 0) {
            console.log(`Devolvido com ${devolucao.dias_atraso} dias de atraso.`)
        }
    }

    private async listar(): Promise<void> {
        const emprestimos = await this.emprestimoController.listar()
        this.mostrarTabela(emprestimos)
    }

    private async listarAtivos(): Promise<void> {
        const emprestimosAtivos = await this.emprestimoController.listarAtivos()
        this.mostrarTabela(emprestimosAtivos)
    }

    private mostrarTabela(emprestimos: EmprestimoDetalhado[]): void {
        if (emprestimos.length === 0) {
            console.log("\nNenhum empréstimo encontrado.")
            return
        }
        console.table(
            emprestimos.map((emprestimo) => ({
                ID: emprestimo.id,
                Cliente: emprestimo.cliente_nome,
                Livro: emprestimo.livro_titulo,
                Empréstimo: emprestimo.data_emprestimo,
                Previsão_Entrega: emprestimo.data_prevista_devolucao,
                Devolução: emprestimo.data_devolucao,
                Situação: emprestimo.situacao
            }))
        )
    }
}