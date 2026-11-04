import { Router } from "express"
import UsuarioController from "../controllers/usuario.controller"
import auth from "../middleware/auth"
import { isAdmin } from "../middleware/isAdmin"

const usuarioRoutes = Router()

usuarioRoutes.post("/", (req, res) => UsuarioController.cadastrar(req, res))
usuarioRoutes.get("/me", auth, (req, res) => UsuarioController.me(req, res))
usuarioRoutes.put("/:id", auth, (req, res) => UsuarioController.atualizar(req, res))
usuarioRoutes.get("/", auth, isAdmin, (req, res) => UsuarioController.listar(req, res))
usuarioRoutes.delete("/:id", auth, isAdmin, (req, res) => UsuarioController.deletar(req, res))

export default usuarioRoutes
