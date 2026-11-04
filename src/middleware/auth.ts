import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import { env } from "../config/env"
import { AppError } from "../utils/AppError"

export default function auth(req: Request, _res: Response, next: NextFunction): void {
    // O cliente envia o token assim: Authorization: Bearer <token>
    const header = req.headers.authorization
    if (!header) {
        throw new AppError("Token não informado.", 401)
    }

    const [tipo, token] = header.split(" ")
    if (tipo !== "Bearer" || !token) {
        throw new AppError("Token mal formatado", 401)
    }

    // jwt.verify confere a assinatura e a validade. Se algo estiver errado, ele lança um erro.
    // O try/catch cobre SÓ o verify, para não engolir o AppError abaixo.

    let payload: string | JwtPayload
    try {
        // "algorithms" fixa o algoritmo aceito ( o mesmo que o sign usa por padrão)
        payload = jwt.verify(token, env.jwt.secret, { algorithms: ["HS256"] })
    } catch {
        throw new AppError("Token inválido ou expirado.", 401)
    }

    // O verify pode devolver string ou objeto; Garantir que o conteúdo é o que se espera
    if (
        typeof payload === "string" ||
        !payload.sub ||
        (payload.perfil !== "usuario" && payload.perfil !== "admin")
    ) {
        throw new AppError("Token inválido.", 401)
    }

    req.usuario = { id: Number(payload.sub), perfil: payload.perfil }

    next()
}
