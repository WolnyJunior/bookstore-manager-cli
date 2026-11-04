import type { Request, Response } from "express"

class HealthController {
    //Responde se a API está no ar. Serve para monitoramentos e testes.
    check(_req: Request, res: Response): void {
        //O "_" indica um parametro que recebemos, mas não usamos
        res.status(200).json({ status: "ok", timeStamp: new Date().toISOString() })
    }
}

export default new HealthController()
