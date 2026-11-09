# BookStore Manager CLI

Sistema de gerenciamento de livraria via terminal, com menus interativos para autores, livros, clientes e empréstimos, gravando os dados em um banco PostgreSQL.

Projeto final do Módulo 01 do curso de Desenvolvedor Back-end Node.Js

## Funcionalidades

- Cadastro, consulta, atualização e remoção de **autores**, **livros** e **clientes**.
- **Empréstimos e Devoluções** com regras de negócio(disponibilidade, atraso e limite de emprestimos ativos)
- **Relatórios gerenciais** feitos com consultas SQL
- Empréstimos e devoluções em **transação**, para manter o estoque consistente


## Tecnologias

- Node.js 20+ e TypeScript
- PostgreSQL, acessado com driver `pg` e SQL via QueryTool no `pgAdmin`
- tsx(execução em desenvolvimento), ESLint e Prettier

## Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- [PostgreSQL](https://www.postgresql.org) instalado e em execução
- [Git](https://git-scm.com)

## Como rodar

### 1. Clonar o repositório
```bash
git clone https://github.com/WolnyJunior/bookstore-manager-cli.git
cd bookstore-manager-cli
```
### 2. Instalar as dependências
```bash
npm install
``` 
### 3. Configurar as variáveis de ambiente
Copie o arquivo de acordo com seu Sistema Operacional; E preencha com os dados do seu banco
```bash
copy .env.example .env # Para Windows.
cp .env.example .env   # Para Linux/Mac:
```
|    Variável          |      Descrição                      |   Padrão       |
|    --------          | -----------------                   |   -------      |
| `DB_HOST`            | Host do PostgreSQL                  | `localhost`    |
| `DB_PORT`            | Porta do PostgreSQL                 | `5432`         |
| `DB_NAME`            | Nome do banco                       | obrigatória    |
| `DB_USER`            | Usuário do banco                    | obrigatória    |
| `DB_PASSWORD`        | Senha do banco                      | obrigatória    |

### 4. Criar o banco de dados

No pgAdmin ou no `psql`, execute:
```sql
CREATE DATABASE bookstore;
```

### 5. Criar as tabelas e os dados de teste
Execute o arquivo `database/script.sql` no banco `bookstore`, pelo Query Tool do pgAdmin ou pelo `psql`:

```bash
psql -U postgres -d bookstore -f database/script.sql
```
>**Atenção:** o script contém arquivos de criação de tabela, inserção de dados nas tabela e consultas.

### 6. Executar a aplicação
```bash
npm run dev
```
Para gerar a versão compilada e executá-la:
```bash
npm run build
npm start
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


## Tratamento de erros
Erros esperados são lançados em `AppError(mensagem, statusCode)` e o middleware `errorHandler` responde sempre em JSON:


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