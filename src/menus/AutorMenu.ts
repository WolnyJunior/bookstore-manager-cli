import { AutorController } from "../controllers/AutorController";
import { AppError } from "../utils/AppError";
import { perguntar } from "../utils/prompt";

export class AutorMenu {
    constructor(private readonly autorController: AutorController) { }

    async exibirMenuAutor(): Promise<void> {
        while (true) {
            console.log("\n=== AUTORES ===")
            console.log("1 - Cadastrar autor")
            console.log("2 - Listar autores")
            console.log("3 - Buscar autor por ID")
            console.log("4 - Atualizar autor")
            console.log("5 - Remover autor")
            console.log("0 - Voltar")

            const opcaoSelecionada = await perguntar("Escolha uma opção:")
            if (opcaoSelecionada === "0")
                return
            await this.executarOpcaoComTratamentoDeErro(opcaoSelecionada)
        }
    }

    private async executarOpcaoComTratamentoDeErro(opcaoSelecionada: string): Promise<void> {
        try {
            await this.executarOpcao(opcaoSelecionada)
        } catch (erro) {
            if (erro instanceof AppError) {
                console.log(`\n ${erro.message}`)
            } else {
                console.error("\nErro inesperado:", erro)
            }
        }
    }

    private async executarOpcao(opcaoSelecionada: string): Promise<void> {
        switch (opcaoSelecionada) {
            case "1":
                return this.cadastrar()
            case "2":
                return this.listar()
            case "3":
                return this.buscarPorId()
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
        const confirmacao = await perguntar(`Deseja cadastrar novo autor? (s/n)`)
        if (confirmacao.toLowerCase() === "s") {

            const nome = await perguntar("Nome:")
            const nacionalidade = await perguntar("Nacionalidade:")
            const data_nascimento = await perguntar("Dataa de nascimento: AAAA-MM-DD")
            const cadastrarNovoAutor = await this.autorController.cadastrar({ nome, nacionalidade, data_nascimento })

            console.log(`\nAutor cadastrado com ID: ${cadastrarNovoAutor.id}`)

        } else {
            console.log("\nOperação cancelada.")
        }
    }

    private async listar(): Promise<void> {
        const autores = await this.autorController.listar()

        if (autores.length === 0) {
            console.log("\nNenhum autor cadastrado.")
            return
        }
        console.table(autores)
    }
    private async buscarPorId(): Promise<void> {
        const id = await perguntar("ID do autor")
        const autor = await this.autorController.buscarPorId(id)
        console.log([autor])
    }

    private async atualizar(): Promise<void> {
        const id = await perguntar("ID do autor que deseja atualizar.")
        const atualizar = await this.autorController.buscarPorId(id)

        console.log("Pressione Enter para manter o valor atual.")
        const nome = await perguntar("Nome:", atualizar.nome)
        const nacionalidade = await perguntar("Nacionalidade:", atualizar.nacionalidade ?? "")
        const data_nascimento = await perguntar("Dataa de nascimento: AAAA-MM-DD", atualizar.data_nascimento ?? "")

        await this.autorController.atualizar(id, { nome, nacionalidade, data_nascimento })
        console.log("\nAutor atualizado com sucesso.")
    }

    private async remover(): Promise<void> {
        const id = await perguntar("ID do autor que deseja remover.")
        const removerAutor = await this.autorController.buscarPorId(id)

        const confirmacao = await perguntar(`Deseja remover "${removerAutor.nome}"? (s/n)`)
        if (confirmacao.toLowerCase() === "s") {
            await this.autorController.remover(id)
            console.log("\nAutor removido com sucesso")
        } else {
            console.log("\nOperação cancelada.")
        }
    }
}

