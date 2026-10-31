# Aulas Node.js: API de Usuários

API REST de cadastro de usuários, feita com **Node.js**, **Express 5**, **Prisma** e **MongoDB**. O projeto nasceu das aulas da DevClub e foi evoluindo para uma estrutura em camadas.

## Tecnologias

- [Node.js](https://nodejs.org/) (ES Modules)
- [Express 5](https://expressjs.com/) para as rotas e o servidor HTTP
- [Prisma ORM](https://www.prisma.io/) para acessar o banco
- [MongoDB Atlas](https://www.mongodb.com/atlas) como banco de dados
- [CORS](https://www.npmjs.com/package/cors) para liberar o acesso do front-end

## Pré-requisitos

- Node.js 18 ou superior
- Uma conta no MongoDB Atlas, com um cluster e um usuário de banco criados

## Como rodar

1. Clone o repositório e entre na pasta:

   ```bash
   git clone <url-do-repositorio>
   cd Aulas-Node.js
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com a string de conexão do seu banco:

   ```env
   DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/Users?appName=Users"
   ```

   > O `.env` não vai para o Git (está no `.gitignore`). Nunca coloque a senha direto no código.

4. Gere o cliente do Prisma e sincronize o schema com o banco:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Suba o servidor em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   O servidor fica disponível em `http://localhost:3000`. O comando `node --watch` reinicia o servidor sozinho quando um arquivo muda.

## Deploy

A API está publicada no [Render](https://render.com/), como Web Service a partir da branch `main`:

- **URL pública**: `https://api-nodes-bt6u.onrender.com`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Variável de ambiente**: `DATABASE_URL` (configurada no painel do Render, nunca no código)

A porta vem da variável `PORT`, que o Render define sozinho. Localmente, a API usa 3000.

O plano gratuito coloca o serviço em repouso depois de 15 minutos sem acesso. A primeira requisição depois disso pode demorar até um minuto.

## Rotas

Base local: `http://localhost:3000/usuarios`
Base publicada: `https://api-nodes-bt6u.onrender.com/usuarios`

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/usuarios` | Lista todos os usuários | 200 |
| GET | `/usuarios/:id` | Busca um usuário pelo id | 200, 400 (id inválido), 404 |
| POST | `/usuarios` | Cria um usuário | 201, 400 (dados inválidos), 409 (email repetido) |
| PUT | `/usuarios/:id` | Substitui todos os dados do usuário | 200, 400, 404 |
| PATCH | `/usuarios/:id` | Altera só os campos enviados | 200, 400, 404 |
| DELETE | `/usuarios/:id` | Remove um usuário | 200, 400, 404 |

### Corpo da requisição

Para POST e PUT, todos os campos são obrigatórios. Para PATCH, envie pelo menos um:

```json
{
  "name": "Athilla Cruz",
  "age": 20,
  "email": "athilla@exemplo.com",
  "genero": "feminino"
}
```

Regras de validação:

- `name`: texto, não vazio
- `age`: número inteiro entre 0 e 150
- `email`: formato `algo@algo.algo`, único no banco
- `genero`: `masculino` ou `feminino`. Usuários cadastrados antes desse campo existir podem não tê-lo.

### Exemplos

```bash
# Criar
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name":"Athilla Cruz","age":20,"email":"athilla@exemplo.com","genero":"feminino"}'

# Alterar só a idade
curl -X PATCH http://localhost:3000/usuarios/<id> \
  -H "Content-Type: application/json" \
  -d '{"age":21}'
```

### Formato dos erros

Erros de validação retornam a lista de problemas:

```json
{
  "message": "Dados inválidos",
  "erros": ["email é obrigatório e deve estar em um formato válido"]
}
```

Os demais erros retornam uma mensagem simples, como `{ "message": "Usuário não encontrado!" }`.

## Estrutura do projeto

```
server.js                              → sobe o servidor na porta 3000
src/
  app.js                               → monta o Express (middlewares e rotas)
  routes/usuarios.routes.js            → define as rotas
  controllers/usuarios.controller.js   → recebe req/res e devolve a resposta
  services/usuarios.service.js         → fala com o Prisma
  middlewares/validarUsuario.js        → valida o corpo das requisições
  middlewares/erros.js                 → trata os erros em um lugar só
  lib/prisma.js                        → conexão única com o banco
prisma/schema.prisma                   → modelo de dados (User)
```

Fluxo de uma requisição: **rota → validação → controller → service → Prisma → MongoDB**.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor com reinício automático |
| `npm start` | Sobe o servidor sem reinício automático (usado no deploy) |
| `npx prisma studio` | Abre uma interface visual do banco em `http://localhost:5555` |

## Autor

Athilla Cruz
