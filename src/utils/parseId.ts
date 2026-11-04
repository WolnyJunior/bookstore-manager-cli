import { AppError } from "./AppError"

//Parâmetros da URL chegam como texto: convertemos e garantimos um inteiro positivo
export function parseId(valor: unknown): number {
    const id = Number(valor)
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError("ID inválido.", 400)
    }
    return id
}
