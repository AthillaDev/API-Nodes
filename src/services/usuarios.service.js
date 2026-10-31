import { prisma } from "../lib/prisma.js"

// O service só fala com o banco. Não sabe nada de req e res.
export async function listarUsuarios() {
  return prisma.user.findMany()
}

// Retorna null quando o usuário não existe (o controller decide o que responder)
export async function buscarUsuario(id) {
  return prisma.user.findUnique({
    where: { id }
  })
}

export async function criarUsuario({ name, age, email }) {
  return prisma.user.create({
    data: { name, age, email }
  })
}

// Campos que chegarem como undefined não são alterados pelo Prisma.
// Por isso o mesmo método serve para PUT (todos os campos) e PATCH (só alguns).
export async function atualizarUsuario(id, { name, age, email }) {
  return prisma.user.update({
    where: { id },
    data: { name, age, email }
  })
}

export async function deletarUsuario(id) {
  return prisma.user.delete({
    where: { id }
  })
}
