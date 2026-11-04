import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"
import { env } from "../config/env"
import { Usuario } from "../models/Usuario"
import { AppError } from "../utils/AppError"
import { toUsuarioPublico, type UsuarioPublico } from "./usuario.service"

interface LoginDTO {
    email: string
    senha: string
}

interface LoginResultado {
    token: string
    usuario: UsuarioPublico
}

const HASH_FALSO = bcrypt.hashSync("senha-false", 10)

class AuthService {
    async login({ email, senha }: LoginDTO): Promise<LoginResultado> {
        const usuario = await Usuario.findOne({ where: { email } })

        const senhaCorreta = await bcrypt.compare(senha, usuario?.senhaHash ?? HASH_FALSO)

        if (!usuario || !senhaCorreta) {
            throw new AppError("Usuário ou senha inválidos.", 401)
        }

        //jwt.sign(payload, chave, opções) cria o token
        // - payload: dados dentro do token( só o perfil; NUNCA senha ou dados sensíveis)
        // - subject: de quem é o token (o id do usuário, que vira do campo "sub")
        // - expiresIn: validade o "as" ajusta o tipo, já que o .env entrega uma string comum
        const token = jwt.sign({ perfil: usuario.perfil }, env.jwt.secret, {
            subject: String(usuario.id),
            // NonNullable remove "undefined" do tipo, o que satisfaz o exactOptionalPropertyTypes
            expiresIn: env.jwt.expiresIn as NonNullable<SignOptions["expiresIn"]>,
        })

        return {
            token,
            usuario: toUsuarioPublico(usuario),
        }
    }
}

export default new AuthService()
