import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError"

// Roda quando nenhuma rota responder: transforma "rota não encontrada" em um AppError 404
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
    next(new AppError("Rota não encontrada", 404)) //next(erro) entrega o erro ao erroHandler
}

// O express reconhece um middleware de erro pelos 4 parâmetros(erro, req, res, next)
//Mesmo sem usar o "next", ele precisa estar na assinatura.
export function errorHandler(erro: Error, _req: Request, res: Response, _next: NextFunction): void {
    //Erro esperado: devolvemos a mensagem e o status definido
    if (erro instanceof AppError) {
        res.status(erro.statusCode).json({ error: erro.message, detalhes: erro.detalhes })
        return
    }
    // Erro inesperado(bug): registramos no servidor, mas Não expomos detalhes ao cliente
    console.error(erro)
    res.status(500).json({ error: "Erro interno do servidor" })
}
