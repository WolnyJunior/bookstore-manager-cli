import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError"

//Deve vir SEMPRE depois do auth, que é quem preenche req.usuario
export function isAdmin(req: Request, _res: Response, next: NextFunction): void {
    // 401 Não identificado
    // 403 Forbidden: Não tem permissão
    if (req.usuario?.perfil !== "admin") {
        throw new AppError("Acesso restrito aos administradores.", 403)
    }

    next()
}
