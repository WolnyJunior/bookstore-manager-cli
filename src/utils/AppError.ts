export class AppError extends Error {
    constructor(message: string) {
        super(message) // chama o construtor do Error com a mensagem
        this.name = "AppError"
    }
}
