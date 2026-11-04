import app from "./app"
import { env } from "./config/env"
import { sequelize } from "./config/database"

async function start(): Promise<void> {
    try {
        await sequelize.authenticate() // testa a conexão com o banco de dados
        console.log("Banco de dados conectado...")

        app.listen(env.port, () => {
            console.log(`Servidor rodando em http://localhost:${env.port}`)
        })
    } catch (error) {
        console.error("Falha ao iniciar a aplicação:", error)
        process.exit(1) // encerra o processo sinalizando erro (código 1)
    }
}

start()
