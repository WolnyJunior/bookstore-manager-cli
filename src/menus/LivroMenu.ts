import { LivroController } from "../controllers/LivroController";
import { LivroDetalhado } from "../models/Livro";
import { AppError } from "../utils/AppError";
import { perguntar } from "../utils/prompt";

export class LivroMenu {
    constructor(private readonly livroController: LivroController) { }

    async exibirMenuLivro(): Promise<void> {
        while (true) {
            console.log("\n=== LIVROS ===")
            console.log("1 - Cadastrar livro")
            console.log("2 - Listar livros")
            console.log("3 - Buscar livro por ID")
            console.log("4 - Atualizar livro")
            console.log("5 - Remover livro")
            console.log("0 - Voltar")

            const opcao = await perguntar("Escolha uma opção: ")
            if (opcao === "0")
                return
            await this.executarSeguro(opcao)
        }
    }

    private async executarSeguro(opcao: string): Promise<void> {
        try {
            await this.executar(opcao)

        } catch (erro) {
            if (erro instanceof AppError) {
                console.log((`\n ${erro.message}`))
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
        const titulo = await perguntar("Título.")
        const genero = await perguntar("Gênero.")
        const isbn = await perguntar("ISBN.")
        const ano_publicacao = await perguntar("Ano de publicação(opcional).")
        const quantidade_total = await perguntar("Quantidade de exemplares.")
        const autor_id = await perguntar("ID do autor.")

        const livro = await this.livroController.cadastrar({ titulo, genero, isbn, ano_publicacao, quantidade_total, autor_id })
        console.log(`\nLivro ${livro.titulo} cadastrado com sucesso.`)
    }
    private async listar(): Promise<void> {
        const livros = await this.livroController.listar()
        if (livros.length === 0) {
            console.log("\nNenhum livro cadastrado.")
            return
        }
        this.mostrarTabela(livros)
    }
    private async buscar(): Promise<void> {
        const id = await perguntar("ID do livro:")
        const buscaLivro = await this.livroController.buscarPorId(id)
        this.mostrarTabela([buscaLivro])
    }
    private async atualizar(): Promise<void> {
        const id = await perguntar("ID do livro que deseja atualizar: ")
        const atualizarLivro = await this.livroController.buscarPorId(id)

        console.log("Pressione Enter para manter o valor atual.")
        const titulo = await perguntar("Título: ", atualizarLivro.titulo)
        const genero = await perguntar("Gênero: ", atualizarLivro.genero)
        const isbn = await perguntar("ISBN: ", atualizarLivro.isbn)
        const ano_publicacao = await perguntar("Ano de publicação: ", String(atualizarLivro.ano_publicacao ?? ""))
        const quantidade_total = await perguntar("Quantidade de exemplares: ", String(atualizarLivro.quantidade_total))
        const autor_id = await perguntar("ID do autor: ", String(atualizarLivro.autor_id))

        await this.livroController.atualizar(id, { titulo, genero, isbn, ano_publicacao, quantidade_total, autor_id })
        console.log("\nLivro atualizado com sucesso")
    }
    private async remover(): Promise<void> {
        const id = await perguntar("ID do livro que deseja deletar: ")
        const livro = await this.livroController.buscarPorId(id)

        const confirmacao = await perguntar(`Remover "${livro.titulo}"? (s/n)`)
        if (confirmacao.toLowerCase() === "s") {
            await this.livroController.deletar(id)
            console.log("\nLivro removido com sucesso.")
        } else {
            console.log("\nOperação cancelada.")
            return
        }
    }

    private mostrarTabela(livros: LivroDetalhado[]): void {
        console.table(
            livros.map((livro) => ({
                ID: livro.id,
                Título: livro.titulo,
                Gênero: livro.genero,
                ISBN: livro.isbn,
                Ano: livro.ano_publicacao,
                Disponíveis: `${livro.quantidade_disponivel}/${livro.quantidade_total}`
            }))
        )
    }
}