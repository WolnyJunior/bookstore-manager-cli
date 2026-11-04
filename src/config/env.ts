import "dotenv/config"

// Lê uma variável obrigatória; se não existir, para a aplicação com uma mensagem clara
function required(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Variável de ambiente ${name} não definida.`)
    }
    return value
}

export const env = {
    // process.env sempre devolve string; Number() converte a porta para número.
    // O "?? 3000" é o valor padrão caso PORT não esteja definida.
    port: Number(process.env.PORT ?? 3000),
    db: {
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        name: required("DB_NAME"),
        user: required("DB_USER"),
        password: required("DB_PASSWORD"),
    },
    jwt: {
        secret: required("JWT_SECRET"), // Obrigat´roia, sem ela a API nem sobe
        expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    },
}
