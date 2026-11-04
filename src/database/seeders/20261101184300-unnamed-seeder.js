require("dotenv").config()
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const email = (process.env.SEED_ADMIN_EMAIL ?? "").trim().toLowerCase()
        const senha = process.env.SEED_ADMIN_PASSWORD ?? ""
        if (!email || senha.length < 8) {
            throw new Error(
                "Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD(mínimo 8 caracteres) no .env",
            )
        }

        const [existeAdmin] = await queryInterface.sequelize.query(
            "SELECT id FROM usuarios WHERE email=:email",
            { replacements: { email } },
        )
        if (existeAdmin.length > 0) {
            console.log("Admin já existe, nada a fazer.")
            return
        }

        const criarAdminPeloSeed = new Date()
        await queryInterface.bulkInsert("usuarios", [
            {
                nome: "Administrador",
                email,
                senha_hash: await bcrypt.hash(senha, 10),
                perfil: "admin",
                created_at: criarAdminPeloSeed,
                updated_at: criarAdminPeloSeed,
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        const email = (process.env.SEED_ADMIN_EMAIL ?? "").trim().toLowerCase()
        await queryInterface.bulkDelete("usuarios", { email })
    },
}
