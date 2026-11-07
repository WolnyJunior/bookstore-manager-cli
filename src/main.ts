import { pool, testConnection } from "./config/database"

async function start(): Promise<void> {
    try {
        console.log("BookStore Manager CLI")
        await testConnection()
        console.log("Banco de dados conectado.")
        // Próximas sprints: abrir menu principal
    } catch (error) {
        console.error("Falha ao iniciar a aplicação:", error)
        process.exitCode = 1 // encerra o processo sinalizando erro (código 1)
    } finally {
        // Por enquanto serve para encerrar o pool.
        // quando existir o meni, vai ser a opção de "encerrar a aplicação."
        await pool.end()
    }
}

start()
