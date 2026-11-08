import { ClienteController } from "../controllers";
import { Cliente } from "../models/Cliente";
import { AppError } from "../utils/AppError";
import { perguntar } from "../utils/prompt";

export class ClienteMenu {
    constructor(private readonly clienteController: ClienteController) { }

    async exibirMenuCliente(): Promise<void> {
        while (true) {
            console.log("\n=== CLIENTES ===")
            console.log("1 - Cadastrar cliente")
            console.log("2 - Listar clientes")
            console.log("3 - Buscar cliente por ID")
            console.log("4 - Atualizar cliente")
            console.log("5 - Remover cliente")
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
                return this.cadastrar()
            case "2":
                return this.listar()
            case "3":
                return this.buscar()
            case "4":
                return this.atualizar()
            case "5":
                return this.remover()
            default:
                console.log("Opção inválida")
                return
        }
    }

    private async cadastrar(): Promise<void> {
        const nome = await perguntar("Nome")
        const email = await perguntar("E-mail")
        const telefone = await perguntar("Telefone (opcional)")

        const cliente = await this.clienteController.cadastrar({ nome, email, telefone })
        console.log(`\nCliente cadastrado com sucesso.`, cliente)
    }

    private async listar(): Promise<void> {
        const clientes = await this.clienteController.listar()
        if (clientes.length === 0) {
            console.log("\nNenhum cliente cadastrado.")
            return
        }
        this.mostrarTabela(clientes)
    }

    private async buscar(): Promise<void> {
        const id = await perguntar("ID do cliente")
        const cliente = await this.clienteController.buscarPorId(id)
        this.mostrarTabela([cliente])
    }

    private async atualizar(): Promise<void> {
        const id = await perguntar("ID do cliente que deseja atualizar.")
        const atualizarCliente = await this.clienteController.buscarPorId(id)

        console.log("Pressione Enter para manter o valor atual.")
        const nome = await perguntar("Nome", atualizarCliente.nome)
        const email = await perguntar("E-mail", atualizarCliente.email)
        const telefone = await perguntar("Telefone", atualizarCliente.telefone ?? "")

        await this.clienteController.atualizar(id, { nome, email, telefone })
        console.log("\nCliente atualizado com sucesso.")
    }

    private async remover(): Promise<void> {
        const id = await perguntar("ID do cliente que deseja deletar.")
        const cliente = await this.clienteController.buscarPorId(id)

        const confirmacao = await perguntar(`Remover "${cliente.nome}"? (s/n)`)
        if (confirmacao.toLowerCase() === "s") {
            await this.clienteController.remover(id)
            console.log("\nCliente removido com sucesso.")
        } else {
            console.log("\nOperação cancelada.")
            return
        }
    }

    private mostrarTabela(clientes: Cliente[]): void {
        console.table(
            clientes.map((cliente) => ({
                ID: cliente.id,
                Nome: cliente.nome,
                "E-mail": cliente.email,
                Telefone: cliente.telefone,
                Cadastro: cliente.data_cadastro
            }))
        )
    }
}