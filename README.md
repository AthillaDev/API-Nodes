# User Management RESTful API | Node.js, Express & Prisma

API REST para cadastro, consulta, edição e exclusão de usuários, com validação de dados, persistência no MongoDB e deploy em produção. Foi desenvolvida como projeto prático do curso da DevClub e consumida por um front-end em React.

## Links rápidos

- **API publicada (Render):** https://api-nodes-bt6u.onrender.com/usuarios
- **Front-end publicado (Vercel):** https://cadastro-de-usuarios-fawn.vercel.app
- **Repositório do front-end:** https://github.com/AthillaDev/Cadastro-de-Usuarios

> A API roda no plano gratuito do Render. Se ela estiver em repouso, a primeira requisição pode levar até um minuto.

## Funcionalidades

- CRUD completo de usuários: criar, listar, buscar por id, substituir (PUT), alterar parcialmente (PATCH) e excluir.
- Validação de todos os dados de entrada, com a lista de erros retornada ao cliente.
- Tratamento de erros centralizado, com códigos HTTP adequados (400, 404, 409 e 500).
- Email único no banco, com bloqueio de cadastros repetidos.
- CORS configurado para o front-end publicado.

## Arquitetura

```
Front-end (React, Vercel)
        │  HTTP (JSON)
        ▼
API (Node.js + Express, Render)
  rota → validação → controller → service
        │
        ▼
Prisma ORM
        │
        ▼
MongoDB Atlas
```

Cada camada tem uma responsabilidade:

- **Rotas** definem os caminhos e os métodos HTTP.
- **Validação** confere o corpo da requisição antes de qualquer acesso ao banco.
- **Controllers** recebem a requisição e devolvem a resposta.
- **Services** são os únicos que falam com o Prisma.
- **Middleware de erros** converte os erros do Prisma e da aplicação em respostas HTTP.

## Decisões técnicas

- **Camadas separadas:** facilita trocar o banco ou a forma de validação sem mexer no resto do código.
- **Erros centralizados:** os controllers não têm `try/catch`. Os erros chegam a um único middleware, o que mantém o código mais limpo.
- **PUT com validação completa e PATCH com validação parcial:** o PUT exige todos os campos, enquanto o PATCH aceita só os campos enviados.
- **Campo `genero` opcional no banco:** usuários cadastrados antes desse campo existir continuam válidos, mas o cadastro novo exige o campo.
- **Porta vinda do ambiente (`PORT`):** o Render define a porta automaticamente, e localmente a API usa 3000.
- **Segredos fora do código:** a string de conexão fica no `.env` (local) e nas variáveis de ambiente do Render.

## Tecnologias

- [Node.js](https://nodejs.org/) (ES Modules)
- [Express 5](https://expressjs.com/) para as rotas e o servidor HTTP
- [Prisma ORM](https://www.prisma.io/) para acessar o banco
- [MongoDB Atlas](https://www.mongodb.com/atlas) como banco de dados
- [CORS](https://www.npmjs.com/package/cors) para liberar o acesso do front-end
- [npm](https://www.npmjs.com/) para gerenciar as dependências

### Infraestrutura

- [GitHub](https://github.com/) para o código-fonte
- [Render](https://render.com/) para hospedar a API (plano gratuito)
- [Vercel](https://vercel.com/) para hospedar o front-end

## Pré-requisitos

- Node.js 18 ou superior
- Uma conta no MongoDB Atlas, com um cluster e um usuário de banco criados

## Como rodar localmente

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/AthillaDev/API-Nodes.git
   cd API-Nodes
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

A API está publicada no Render como Web Service a partir da branch `main`:

- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npm start`
- **Variável de ambiente:** `DATABASE_URL` (configurada no painel do Render, nunca no código)

Cada push para a `main` gera um novo deploy automaticamente.

## Rotas

Base local: `http://localhost:3000`
Base publicada: `https://api-nodes-bt6u.onrender.com`

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/` | Mensagem de boas-vindas | 200 |
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
server.js                              → sobe o servidor (PORT ou 3000)
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

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor com reinício automático |
| `npm start` | Sobe o servidor sem reinício automático (usado no deploy) |
| `npx prisma studio` | Abre uma interface visual do banco em `http://localhost:5555` |

## Autor

Athilla Cruz — [GitHub](https://github.com/AthillaDev)
