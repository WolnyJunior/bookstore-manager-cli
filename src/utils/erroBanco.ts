export const ERRO_UNIQUE = "23505"
export const ERRO_CHAVE_ESTRANGEIRA = "23503"
export const ERRO_CHECK = "23514"

export function codigoErroBanco(erro: unknown): string | undefined {
    if (
        typeof erro === "object" &&
        erro !== null &&
        "code" in erro &&
        typeof erro.code === "string"
    ) {
        return erro.code
    }
    return undefined
}
