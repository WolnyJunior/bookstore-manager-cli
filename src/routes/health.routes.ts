import { Router } from "express"
import healthController from "../controllers/health.controller"

const healthRoutes = Router()

healthRoutes.get("/", (req, res) => healthController.check(req, res))

export default healthRoutes
