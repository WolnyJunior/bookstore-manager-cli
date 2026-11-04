"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    // up: o que a migration FAZ quando é executada
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("usuarios", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nome: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true, // unique para não repetir email no cadastro.
            },
            senha_hash: {
                // guardar o hash no banco, nunca a senha verdadeira
                type: Sequelize.STRING,
                allowNull: false,
            },
            perfil: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: "usuario",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("usuarios")
    },
}
