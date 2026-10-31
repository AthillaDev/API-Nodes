// Ponto de entrada da API de usuários.
// Estrutura do projeto (anotações de estudo em anotacoes-estudo.md, fora do Git):
//   src/app.js                              → monta o Express (middlewares e rotas)
//   src/routes/usuarios.routes.js           → define as rotas
//   src/controllers/usuarios.controller.js  → recebe req/res e devolve a resposta
//   src/services/usuarios.service.js        → fala com o Prisma
//   src/middlewares/                        → validação e tratamento de erros
//   src/lib/prisma.js                       → conexão única com o banco

import app from "./src/app.js"

// O Render define a porta pela variável PORT. Localmente, usa 3000.
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`)
})
