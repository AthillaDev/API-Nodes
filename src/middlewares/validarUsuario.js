// Regras de validação, reutilizadas pelos dois middlewares abaixo
const nomeValido = (name) => typeof name === "string" && name.trim() !== ""
const idadeValida = (age) => Number.isInteger(age) && age >= 0 && age <= 150
const emailValido = (email) => typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const generoValido = (genero) => genero === "masculino" || genero === "feminino"

// Usado no POST e no PUT: todos os campos são obrigatórios
// Middleware de validação: confere o corpo do pedido antes de chegar ao controller.
// Se algo estiver errado, responde 400 e não chama o banco.
export function validarUsuario(req, res, next) {
  // No Express 5, req.body pode vir undefined quando o pedido não tem JSON
  const { name, age, email, genero } = req.body ?? {}
  const erros = []

  if (!nomeValido(name)) {
    erros.push("name é obrigatório e deve ser um texto")
  }

  // Não aceita texto como "20": o número precisa ser de verdade
  if (!idadeValida(age)) {
    erros.push("age é obrigatório e deve ser um número inteiro entre 0 e 150")
  }

  if (!emailValido(email)) {
    erros.push("email é obrigatório e deve estar em um formato válido")
  }

  if (!generoValido(genero)) {
    erros.push("genero é obrigatório e deve ser 'masculino' ou 'feminino'")
  }

  if (erros.length > 0) {
    return res.status(400).json({ message: "Dados inválidos", erros })
  }

  // Tudo certo: passa para o próximo passo (o controller)
  next()
}

// Usado no PATCH: os campos são opcionais, mas os que chegarem precisam ser válidos
export function validarUsuarioParcial(req, res, next) {
  const { name, age, email, genero } = req.body ?? {}
  const erros = []

  if (name === undefined && age === undefined && email === undefined && genero === undefined) {
    erros.push("envie pelo menos um campo: name, age, email ou genero")
  }

  if (name !== undefined && !nomeValido(name)) {
    erros.push("name deve ser um texto não vazio")
  }

  if (age !== undefined && !idadeValida(age)) {
    erros.push("age deve ser um número inteiro entre 0 e 150")
  }

  if (email !== undefined && !emailValido(email)) {
    erros.push("email deve estar em um formato válido")
  }

  if (genero !== undefined && !generoValido(genero)) {
    erros.push("genero deve ser 'masculino' ou 'feminino'")
  }

  if (erros.length > 0) {
    return res.status(400).json({ message: "Dados inválidos", erros })
  }

  next()
}
