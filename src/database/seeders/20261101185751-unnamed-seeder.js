const bcrypt = require("bcryptjs")

const EXEMPLOS = [
    { nome: "Sorin", email: "sorin@email.com" },
    { nome: "Usuario 2", email: "usuario2@email.com" },
    { nome: "Usuario 3", email: "usuario3@email.com" },
    { nome: "Usuario 4", email: "usuario4@email.com" },
    { nome: "Usuario 5", email: "usuario5@email.com" },
]

const EMAILS = EXEMPLOS.map((u) => u.email)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Seeder de exemplo, não pode rodar em produção.")
        }

        // Descobre quais ja existem, para inserir só os que faltam
        const [existeExemplos] = await queryInterface.sequelize.query(
            "SELECT email FROM usuarios WHERE email IN( :emails)",
            { replacements: { emails: EMAILS } },
        )
        const jaExistem = existeExemplos.map((linha) => linha.email)
        const senhaHash = await bcrypt.hash("12345678", 10) //senha de exemplo
        const criarSeddersAgora = new Date()

        const seeders = EXEMPLOS.filter((u) => !jaExistem.includes(u.email)).map((u) => ({
            ...u,
            senha_hash: senhaHash,
            perfil: "usuario",
            created_at: criarSeddersAgora,
            updated_at: criarSeddersAgora,
        }))

        if (seeders.length > 0) {
            await queryInterface.bulkInsert("usuarios", seeders)
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("usuarios", { email: EMAILS })
    },
}
