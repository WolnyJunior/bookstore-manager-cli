import { defineConfig } from "vitest/config"

export default defineConfig({
    test:{
        environment:"node",
        include:["src/**/*.test.ts"], //testes ficam ao lado do código: arquivo.test.ts
        // Variáveis só dos testes: eles não dependem do .env nem do banco
        // O dotenv não sobrescreve variáveis já definidas, então elas valem durante os testes
        env:{
            DB_NAME:"teste",
            DB_USER:"teste",
            DB_PASSWORD:"teste",
            JWT_SECRET:"segredo-apenas-para-teste",
            JWT_EXPIRES_IN:"1h"
        }
    }
})