# Boilerplate Node.js + TypeScript
API REST base com:
- Express;
- Sequelize;
- PostgreSQL;
- Autenticação JWT;
- Validação de entrada;
- Tratamento de erros padronizado;;
- Testes;
- Padrão de código.

Feita para ser usada como template de novos projetos.

**Stack:** Node.js · TypeScript · Express · Sequelize · PostgreSQL · JWT · Vitest · ESLint · Prettier

## Requisitos
- Node.js 20+
- Git
- PostgreSQL

## Como iniciar
```bash
git clone <https://github.com/WolnyJunior/boilerplate-nodejs-TS.git>
cd boilerplate-nodejs-ts
npm install
# copie o arquivo de acordo com seu Sistema Operacional
copy .env.example .env # Para Windows.
cp .env.example .env   # Para Linux/Mac:
```

1. Edite o `.env` com os dados do seu banco.
2. Crie o banco no PostgreSQL: `CREATE DATABASE boilerplate_db`
3. Rode as migrations e inicie:
``` bash
npm run db:migrate
npm run dev
```
A API sobe em `http://localhost:3000`

## Scripts
- `npm run dev` | Roda em desenvolvimento(reinicia ao salvar)
- `npm run build` | Compila o TypeScript para `dist/`
- `npm start` | Roda o código compilado
- `npm test` | Executa os testes automatizados uma vez |
- `npm run test:watch` | Executa os testes e reexecuta a cada alteração |
- `npm run lint` | Verifica problemas no código (ESLint) |
- `npm run lint:fix` | Corrige automaticamente o que for possível |
- `npm run format` | Formata o código (Prettier) |
- `npm run format:check` | Apenas verifica a formatação |
- `npm run typecheck` | Verifica os tipos do TypeScript sem gerar arquivos |
- `npm run db:migrate` | Executa as migrations pendentes
- `npm run db:migrate:undo` | Desfaz a última migration
- `npm run db:migration:create --nome` | Cria nova migration
- `npm run db:seed` | Popula o banco (admin inicial e usuarios de exemplo)
- `npm run db:seed:undo` | Remove do dados criados pelos seeders
- `npm run db:seed:create -- nome` | Cria um novo seeder

## Variáveis de ambiente
|    Variável          |      Descrição                      |   Padrão       |
|    --------          | -----------------                   |   -------      |
| `PORT`               | Porta do Servidor                   | `3000`         |
| `DB_HOST`            | Host do PostgreSQL                  | `localhost`    |
| `DB_PORT`            | Porta do PostgreSQL                 | `5432`         |
| `DB_NAME`            | Nome do banco                       | obrigatória    |
| `DB_USER`            | Usuário do banco                    | obrigatória    |
| `DB_PASSWORD`        | Senha do banco                      | obrigatória    |
| `JWT_SECRET`         | Chave do Token JWT                  | obrigatória    |
| `JWT_EXPIRES_IN`     | Validade do Token                   | `1d`           |
| `SEED_ADMIN_EMAIL`   | E-mail do admin, criado pelo seeder | Só para o seed |
| `SEED_ADMIN_PASSWORD`| Senha do admin(min 8 caracteres)    | Só para o seed |

Para gerar uma `JWT_SECRET`
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Endpoints
| Método |    Rota        |          Descrição             |
| ------ | -------------- |          ---------             |
|  GET   | `/health`      | Verifica se a API está no ar   |
|  POST  | `/usuarios`    | Cadastra novo usuário          |
|  POST  | `/login`       | Autentica e retorna token JWT  |
|  GET   | `/usuarios/me` | Dados do usuário logado        |
|  PUT   | `/usuarios/:id`| Atualiza usuários              |
|  GET   | `/usuarios`    | Lista de usuários              |
| DELETE | `/usuarios/:id`| Remove um usuário pelo id      |

- `PUT` = Atualiza `nome` e `email`(a própria conta, ou qualquer uma se for admin).
Só admin altera `perfil` de outros usuários

## Tratamento de erros
Erros esperados são lançados em `AppError(mensagem, statusCode)` e o middleware `errorHandler` responde sempre em JSON:
```json
{ "error": "Rota não encontrada" }
```
Rotas inexistentes retornam `404` e erros inesperados retornam `500`

Erros de validação trazem a lista completa por campo:
```json
{
    "error": "Dados inválidos",
    "detalhes": [
        {"campo": "email", "mensagem": "E-mail inválido"},
        {"campo": "senha", "mensagem": "A senha deve ter pelo menos 8 caracteres."},
    ]
}
```
No login, credenciais incorretas retornam sempre `E-email ou senha inválidos`(`401`),
sem indicar qual dos dois falhou, para não revelar quais e-mails possuem conta.

## Autenticação
O login devolve um JWT. Nas rotas protegidas, envie-o no cabeçalho:

Authorization: Bearer <token>

- `auth`: valida o token e identifica o usuário(`401` se ausente ou inválido)
- `isAdmin`: deve vir depois do `auth` e restringe a rota a administradores(`403` se não for `admin`)

O perfil fica gravado dentro do token, então, uma mudança de perfil só vale a partir do novo login.

A troca de senha não faz parte do `PUT /usuarios/:id`.

### Primeiro `admin`
O Cadastro sempre cria com perfil `usuário`. Para criar o primeiro admin, cadastre o usuário e promova-o direto no banco de dados:
```bash
npm run db:seed
```
O comando também cria 5 usuários de exemplo (senha = `12345678`), que **NÃO rodam em produção
```bash
npx sequelize-cli db:seed --seed <arquivo-admin-inicial>.js
```
Os seeder podem se executados mais de uma vez sem duplicar registros.

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
├── middleware/ - # autenticação, permissões e tratamento de erros
├── models/ - # modelos do banco (Sequelize)
├── routes/ - # ligam URLs, middlewares e controllers
├── services/ - # regras de negócio
├── types/ - # extensões de tipos (ex.: req.usuario)
├── utils/ - # funções auxiliares (AppError, parseId)
└── validators/ - # validação do formato dos dados de entrada

O fluxo de uma requisição é `routes -> controller -> service -> model`,
E a validação acontece no controller, antes do service.

## Adicionando um novo módulo
1. Crie a migration (`npm run db:migration:create -- nome`) e rode `npm run db:migrate`.
2. Crie o model em `src/models`.
3. Crie o validator em `src/validators`.
4. Crie o service e o controller.
5. Crie as rotas e registre-as em `src/routes/index.ts`.
6. Escreva os testes (`*.test.ts`) e atualize a tabela de endpoints.

## Usando como template
1. No GitHub, clique em **Use this template → Create a new repository**.
2. Clone o novo repositório, ajuste o `name` no `package.json` e o título deste README.
3. Crie a branch `develop` (`git checkout -b develop` e `git push -u origin develop`) para seguir o gitflow.

## Fluxo de trabalho (Git)
- `main`: versões estáveis, marcadas com tags (`v1.0.0`).
- `develop`: integração do trabalho em andamento.
- `feature/*`: uma tarefa por branch, nasce da `develop` e volta por Pull Request.
- `release/*`: preparação de uma versão, termina na `main` e volta para a `develop`.
- Commits no padrão Conventional Commits: `feat`, `fix`, `docs`, `style`, `test`, `chore`.