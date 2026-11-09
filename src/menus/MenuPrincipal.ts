import { perguntar } from "../utils/prompt"
import { AutorMenu } from "./AutorMenu"
import { LivroMenu } from "./LivroMenu"
import { ClienteMenu } from "./ClienteMenu"
import { EmprestimoMenu } from "./EmprestimoMenu"

export class MenuPrincipal {
    constructor(
        private readonly autorMenu: AutorMenu,
        private readonly livroMenu: LivroMenu,
        private readonly clienteMenu: ClienteMenu,
        private readonly emprestimoMenu: EmprestimoMenu
    ) {}

    async exibir(): Promise<void> {
        while (true) {
            console.log("\n=== BOOKSTORE MANAGER ===")
            console.log("1 - Autores")
            console.log("2 - Livros")
            console.log("3 - Clientes")
            console.log("4 - Empréstimos")
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
            else if (opcao === "3") await this.clienteMenu.exibirMenuCliente()
            else if (opcao === "4") await this.emprestimoMenu.exibirMenuEmprestimo()
            else console.log("\nopção inválida.")
        }
    }
}
