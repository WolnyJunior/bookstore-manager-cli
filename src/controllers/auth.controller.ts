import type { Request, Response } from "express"
import authService from "../services/auth.service"
import { validarLogin } from "../validators/auth.validator"

class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        const dados = validarLogin(req.body ?? {})
        const resultado = await authService.login(dados)

        res.status(200).json(resultado)
    }
}

export default new AuthController()
