async function start(): Promise<void> {
    try {
        console.log("BookStore Manager CLI")
        // Sprint 2: conectar ao DB
        // Próximas sprints: abrir menu principal
    } catch (error) {
        console.error("Falha ao iniciar a aplicação:", error)
        process.exit(1) // encerra o processo sinalizando erro (código 1)
    }
}

start()
