// Middleware de erro central: recebe qualquer erro lançado nas rotas e devolve a resposta certa.
// Precisa dos 4 parâmetros (err, req, res, next) para o Express reconhecer como tratador de erro.
export function tratarErros(err, req, res, next) {
  // P2025 = registro não encontrado
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Usuário não encontrado!" })
  }

  // P2023 = id com formato inválido
  if (err.code === "P2023") {
    return res.status(400).json({ message: "ID inválido!" })
  }

  // P2002 = valor único repetido (email já cadastrado)
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Este email já está cadastrado!" })
  }

  // Qualquer outro erro é falha do servidor
  console.error(err)
  res.status(500).json({ message: "Erro interno do servidor" })
}
