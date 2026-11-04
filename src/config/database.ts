import { Sequelize } from "sequelize"
import { env } from "./env"

// Instância única do Sequelize, compartilhada por toda a aplicação.
// Os moldes vão importarr esta instância para se registrarem no banco.
export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: "postgres", //qual banco o Sequelize vai usar( via driver "pg" )
    logging: false, // não imprime cada SQL no console( use console.log para depurar )
})
