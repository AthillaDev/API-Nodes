import { PrismaClient } from "../../generated/prisma/client.js"

// Uma única conexão com o banco, compartilhada por todo o projeto
export const prisma = new PrismaClient()
