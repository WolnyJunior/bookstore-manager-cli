declare module "express-serve-static-core" {
    interface Request {
        usuario?: { id: number; perfil: "usuario" | "admin" } // "?" porque só existe depois do auth
    }
}

export {} // faz desse arquivo um módulo
