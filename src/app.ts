import express from "express"
import routes from "./routes"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"

const app = express()

app.use(express.json()) //permite ler o corpo das requisições em JSON
app.use(routes)

app.use(notFoundHandler) // 1º: rota que não existe vira 404
app.use(errorHandler) // 2º: qualquer erro vai aqui e vira resposta JSON

export default app
