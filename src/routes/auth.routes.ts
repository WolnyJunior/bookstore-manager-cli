import { Router } from "express"
import AuthController from "../controllers/auth.controller"

const authRoutes = Router()

authRoutes.post("/", (req, res) => AuthController.login(req, res))

export default authRoutes
