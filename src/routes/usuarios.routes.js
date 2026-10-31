import { Router } from "express"
import * as controller from "../controllers/usuarios.controller.js"
import { validarUsuario, validarUsuarioParcial } from "../middlewares/validarUsuario.js"

// Este arquivo só define as rotas. O caminho base /usuarios é definido no app.js
const router = Router()

router.get("/", controller.listar)
router.get("/:id", controller.buscarPorId)
router.post("/", validarUsuario, controller.criar)
// PUT substitui o usuário inteiro, então exige os mesmos campos do POST
router.put("/:id", validarUsuario, controller.atualizar)
router.patch("/:id", validarUsuarioParcial, controller.atualizar)
router.delete("/:id", controller.deletar)

export default router
