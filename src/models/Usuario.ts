import { DataTypes, Model } from "sequelize"
import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize"
import { sequelize } from "../config/database"

// Model<Atributos, AtributosParaCriar>: o Sequelize deduz os tipos a partir da própria classe
export class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
    // "declare" é OBRIGATÓRIO aqui: avisa ao TypeScript que o campo existe, mas NÃO cria
    // uma propriedade na classe. Sem ele, o target ES2022 criaria campos vazios que
    // "escondem" os getters que o Sequelize define, e os valores viriam undefined.
    // CreationOptional = campo que o banco preenche sozinho, então não precisa ser informado no create.
    declare id: CreationOptional<number>
    declare nome: string
    declare email: string
    declare senhaHash: string
    declare perfil: CreationOptional<"usuario" | "admin"> // o TS limita os valores válidos
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

// init liga a classe à tabela e descreve cada coluna
Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        senhaHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        perfil: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "usuario",
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize, // a conexão criada em config/database.ts
        tableName: "usuarios", // nome exato da tabela no banco
        underscored: true, // converte camelCase (senhaHash) para snake_case(senha_hash) nas colunas
    },
)
