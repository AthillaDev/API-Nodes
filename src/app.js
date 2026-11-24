import express from "express"
import cors from "cors"
import usuariosRoutes from "./routes/usuarios.routes.js"
import { tratarErros } from "./middlewares/erros.js"

// Monta o Express: middlewares e rotas. Não sobe o servidor, isso é papel do server.js
const app = express()
app.use(express.json())
app.use(cors())

// Rota de boas-vindas: sem ela, abrir a raiz do site mostra "Cannot GET /"
app.get("/", (req, res) => {
  res.json({ message: "API de usuários no ar. Acesse /usuarios" })
})

app.use("/usuarios", usuariosRoutes)

// Precisa ficar depois das rotas: é aqui que os erros caem
app.use(tratarErros)

export default app
