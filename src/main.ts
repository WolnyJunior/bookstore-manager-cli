import { pool, testConnection } from "./config/database"
import { AutorController, LivroController } from "./controllers"
import { AutorMenu, LivroMenu, MenuPrincipal } from "./menus"
import { AutorRepository, LivroRepository } from "./repositories"
import { AutorService, LivroService } from "./services"
import { fecharPrompt } from "./utils/prompt"

async function start(): Promise<void> {
    try {
        console.log("BookStore Manager CLI")
        await testConnection()
        console.log("Banco de dados conectado.")
        // Próximas sprints: abrir menu principal

        const autorMenu = new AutorMenu(new AutorController(new AutorService(new AutorRepository())))
        const livroMenu = new LivroMenu(new LivroController(new LivroService(new LivroRepository)))

        await new MenuPrincipal(autorMenu, livroMenu).exibir()

    } catch (error) {

        console.error("Falha ao iniciar a aplicação:", error)
        process.exitCode = 1 // encerra o processo sinalizando erro (código 1)

    } finally {
        fecharPrompt()
        // Por enquanto serve para encerrar o pool.
        // quando existir o menu, vai ser a opção de "encerrar a aplicação."
        await pool.end()
    }
}

start()
