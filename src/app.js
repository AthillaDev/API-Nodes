import express from "express"
import cors from "cors"
import usuariosRoutes from "./routes/usuarios.routes.js"
import { tratarErros } from "./middlewares/erros.js"

// Monta o Express: middlewares e rotas. Não sobe o servidor, isso é papel do server.js
const app = express()
app.use(express.json())
app.use(cors())

app.use("/usuarios", usuariosRoutes)

// Precisa ficar depois das rotas: é aqui que os erros caem
app.use(tratarErros)

export default app
