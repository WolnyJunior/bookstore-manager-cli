import { pool, testConnection } from "./config/database"
import { AutorController } from "./controllers/AutorController"
import { AutorMenu } from "./menus/AutorMenu"
import { AutorRepository } from "./repositories/AutorRepository"
import { AutorService } from "./services/AutorService"
import { fecharPrompt } from "./utils/prompt"

async function start(): Promise<void> {
    try {
        console.log("BookStore Manager CLI")
        await testConnection()
        console.log("Banco de dados conectado.")
        // Próximas sprints: abrir menu principal

        const autorMenu = new AutorMenu(
            new AutorController(new AutorService(new AutorRepository())),
        )
        await autorMenu.exibirMenuAutor()
    } catch (error) {
        console.error("Falha ao iniciar a aplicação:", error)
        process.exitCode = 1 // encerra o processo sinalizando erro (código 1)
    } finally {
        fecharPrompt()
        // Por enquanto serve para encerrar o pool.
        // quando existir o meni, vai ser a opção de "encerrar a aplicação."
        await pool.end()
    }
}

start()
