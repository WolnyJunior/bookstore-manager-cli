import { Router } from "express"
import healthRoutes from "./health.routes"
import usuarioRoutes from "./usuario.routes"
import authRoutes from "./auth.routes"

const routes = Router()

routes.use("/health", healthRoutes)
routes.use("/usuarios", usuarioRoutes)
routes.use("/login", authRoutes)

export default routes
