import * as service from "../services/usuarios.service.js"

// O controller recebe req e res, chama o service e devolve a resposta.
// Não precisa de try/catch: se algo falhar, o erro vai para o middleware de erro (src/middlewares/erros.js)
export async function listar(req, res) {
  const users = await service.listarUsuarios()

  res.status(200).json(users)
}

export async function buscarPorId(req, res) {
  const user = await service.buscarUsuario(req.params.id)

  // findUnique devolve null quando não encontra, então a resposta 404 é decidida aqui
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" })
  }

  res.status(200).json(user)
}

export async function criar(req, res) {
  const user = await service.criarUsuario(req.body)

  // Uma boa pratica e retornar o json do usuário criado, esse json tem o status 201
  res.status(201).json(user)
}

// Usada pelo PUT e pelo PATCH
export async function atualizar(req, res) {
  const user = await service.atualizarUsuario(req.params.id, req.body)

  // Uma boa pratica e retornar o json do usuário criado, esse json tem o status 200
  res.status(200).json(user)
}

export async function deletar(req, res) {
  await service.deletarUsuario(req.params.id)

  res.status(200).json({ message: "Usuário deletado com sucesso!" })
}
