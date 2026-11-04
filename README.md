# BookStore Manager CLI

Sistema de gerenciamento de livraria via terminal, com menus interativos para autores, livros, clientes e empréstimos.


## Tecnologias
- Node.js
- TypeScript
- PostgreSQL

## Como rodar
```bash
npm install
# copie o arquivo de acordo com seu Sistema Operacional; E preencha com os dados do seu banco
copy .env.example .env # Para Windows.
cp .env.example .env   # Para Linux/Mac:
```

## Scripts
- `npm run dev` | Roda em desenvolvimento(reinicia ao salvar)
- `npm run build` | Compila o TypeScript para `dist/`
- `npm start` | Roda o código compilado
- `npm run lint` | Verifica problemas no código (ESLint) |
- `npm run lint:fix` | Corrige automaticamente o que for possível |
- `npm run format` | Formata o código (Prettier) |
- `npm run format:check` | Apenas verifica a formatação |
- `npm run typecheck` | Verifica os tipos do TypeScript sem gerar arquivos |
- `npm run db:seed` | Popula o banco (admin inicial e usuarios de exemplo)
- `npm run db:seed:undo` | Remove do dados criados pelos seeders
- `npm run db:seed:create -- nome` | Cria um novo seeder

## Variáveis de ambiente
|    Variável          |      Descrição                      |   Padrão       |
|    --------          | -----------------                   |   -------      |
| `DB_HOST`            | Host do PostgreSQL                  | `localhost`    |
| `DB_PORT`            | Porta do PostgreSQL                 | `5432`         |
| `DB_NAME`            | Nome do banco                       | obrigatória    |
| `DB_USER`            | Usuário do banco                    | obrigatória    |
| `DB_PASSWORD`        | Senha do banco                      | obrigatória    |
| `SEED_ADMIN_EMAIL`   | E-mail do admin, criado pelo seeder | Só para o seed |
| `SEED_ADMIN_PASSWORD`| Senha do admin(min 8 caracteres)    | Só para o seed |



## Tratamento de erros
Erros esperados são lançados em `AppError(mensagem, statusCode)` e o middleware `errorHandler` responde sempre em JSON:

## Banco de dados
O projeto usa Sequelize com PostgreSQL. As alterações no banco são feitas por migrations
(`src/database/migrations`, em javaScript por exigência do `sequelize-cli`)
e os models ficam em `src/models`(TypeScript).
Para alterar uma tabela, crie uma nova migration: não edite uma já executada.

## Testes
Os testes usam Vitest e Supertest e ficam ao lado do código, em arquivos `*.test.ts`
Eles **não precisam de banco de dados**: cobrem validações, rotas, autenticação e permissões.
As variáveis de ambiente dos testes ficam em `vitest.config.mts`.

O build (`npm run build`) usa `tsconfig.build.json`, que excluir os testes do `dist/`

## Padrão de código
O estilo é definido pelo Prettier(`.prettierrc.json`) e as boas práticas pelo `ESLint`
```bash
npm run lint
npm run format
npm run typecheck
```
> O TypeScript está fixado na série 6.0 (`~6.0.0`) porque o `typescript-eslint` ainda não suporta a versão 7. Ao atualizar, confira antes a compatibilidade.


## Estrutura de pastas

src/
├── main.ts - # inicia o servidor
├── app.ts - # configura o Express (JSON, rotas, erros)
├── config/ - # variáveis de ambiente e conexão com o banco
├── controllers/ - # recebem a requisição e devolvem a resposta
├── database/ - # configuração do sequelize-cli, migrations e seeders
├── models/ - # modelos do banco (Sequelize)
├── services/ - # regras de negócio
├── types/ - # extensões de tipos (ex.: req.usuario)
├── utils/ - # funções auxiliares (AppError, parseId)


## Fluxo de trabalho (Git)
- `main`: versões estáveis, marcadas com tags (`v1.0.0`).
- `develop`: integração do trabalho em andamento.
- `feature/*`: uma tarefa por branch, nasce da `develop` e volta por Pull Request.
- `release/*`: preparação de uma versão, termina na `main` e volta para a `develop`.
- Commits no padrão Conventional Commits: `feat`, `fix`, `docs`, `style`, `test`, `chore`.