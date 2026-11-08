import { perguntar } from "../utils/prompt"
import { AutorMenu } from "./AutorMenu"
import { LivroMenu } from "./LivroMenu"

export class MenuPrincipal {
    constructor(
        private readonly autorMenu: AutorMenu,
        private readonly livroMenu: LivroMenu,
    ) {}

    async exibir(): Promise<void> {
        while (true) {
            console.log("\n=== BOOKSTORE MANAGER ===")
            console.log("1 - Autores")
            console.log("2 - Livros")
            console.log("0 - Encerrar aplicação")

            const opcao = await perguntar("Escolha uma opção: ")
            if (opcao === "0") {
                const confirmacao = await perguntar(`Deseja encerrar a aplicação? (s/n)`)
                if (confirmacao.toLowerCase() === "s") {
                    console.log("\nAplicação foi encerrada.")
                    return
                }
            }
            if (opcao === "1") await this.autorMenu.exibirMenuAutor()
            else if (opcao === "2") await this.livroMenu.exibirMenuLivro()
            else console.log("\nopção inválida.")
        }
    }
}
