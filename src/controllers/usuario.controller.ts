import type { Request, Response } from "express"
import usuarioService from "../services/usuario.service"
import { AppError } from "../utils/AppError"
import { parseId } from "../utils/parseId"
import { validarAtualizacao, validarCadastro } from "../validators/usuario.validator"

class UsuarioController {
    async cadastrar(req: Request, res: Response): Promise<void> {
        //"?? {}" evita erro caso a requisição cenha sem corpo(req.body undefined)
        const dados = validarCadastro(req.body ?? {})
        const usuario = await usuarioService.cadastrar(dados)

        res.status(201).json(usuario)
    }
    async me(req: Request, res: Response): Promise<void> {
        // req.usuario é preenchido pelo middleware auth; conferimos para o TypeScript e por segurança
        if (!req.usuario) {
            throw new AppError("Não autenticado.", 401)
        }
        const usuario = await usuarioService.buscarPorId(req.usuario.id)
        res.status(200).json(usuario)
    }
    async listar(_req: Request, res: Response): Promise<void> {
        const usuarios = await usuarioService.listar()
        res.status(200).json(usuarios)
    }
    async atualizar(req: Request, res: Response): Promise<void> {
        if (!req.usuario) {
            throw new AppError("Não autenticado", 401)
        }

        const id = parseId(req.params.id)
        const dados = validarAtualizacao(req.body ?? {})

        //Passar req.usuario(id e perfil do token) para o service decidir as permissões
        const usuario = await usuarioService.atualizar(id, dados, req.usuario)

        res.status(200).json(usuario)
    }
    async deletar(req: Request, res: Response): Promise<void> {
        if (!req.usuario) {
            throw new AppError("Não autenticado.", 401)
        }
        const id = parseId(req.params.id)

        await usuarioService.deletar(id, req.usuario.id)
        res.status(204).send()
    }
}

export default new UsuarioController()
