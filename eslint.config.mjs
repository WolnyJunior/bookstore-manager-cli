import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
    //Pastas qie o ESLint ignora. As migrations e seeders são javascript com "require"
    // (exigência do sequelize-cli), então ficam de fora das regras do TypeScript.
    globalIgnores(["dist/", "node_modules", "src/database/"]),

    js.configs.recommended, // Regras recomendadas do ESLint
    tseslint.configs.recommended, // Regras recomendadas para TypesCript
    {
        rules:{
            //Parãmetros iniciados por "_"(como _req e _next)são "de propósito não usados"
            "@typescript-eslint/no-unused-vars":["error", {argsIgnorePattern:"^_"}],
        },
    },
    prettier,   //SEMPRE por ultimo: desliga as regras de estilo que conflitam com o Prettier
])