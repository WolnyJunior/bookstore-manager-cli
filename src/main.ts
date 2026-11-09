import { pool, testConnection } from "./config/database"
import {
    AutorController,
    ClienteController,
    LivroController,
    EmprestimoController,
} from "./controllers"
import { AutorMenu, LivroMenu, MenuPrincipal, ClienteMenu, EmprestimoMenu } from "./menus"
import {
    AutorRepository,
    ClienteRepository,
    LivroRepository,
    EmprestimoRepository,
} from "./repositories"
import { AutorService, ClienteService, LivroService, EmprestimoService } from "./services"
import { fecharPrompt } from "./utils/prompt"

async function start(): Promise<void> {
    try {
        console.log("BookStore Manager CLI")
        await testConnection()
        console.log("Banco de dados conectado.")
        // Próximas sprints: abrir menu principal

        const clienteRepository = new ClienteRepository()
        const livroRepository = new LivroRepository()

        const autorMenu = new AutorMenu(
            new AutorController(new AutorService(new AutorRepository())),
        )
        const livroMenu = new LivroMenu(
            new LivroController(new LivroService(new LivroRepository())),
        )
        const clienteMenu = new ClienteMenu(
            new ClienteController(new ClienteService(new ClienteRepository())),
        )
        const emprestimoMenu = new EmprestimoMenu(
            new EmprestimoController(
                new EmprestimoService(
                    new EmprestimoRepository(),
                    clienteRepository,
                    livroRepository,
                ),
            ),
        )

        await new MenuPrincipal(autorMenu, livroMenu, clienteMenu, emprestimoMenu).exibir()
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
