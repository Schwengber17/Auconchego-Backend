// src/services/TutorService.ts
import { PrismaClient } from "@prisma/client"
import type { ITutorCreate, ITutorUpdate } from "../interfaces/Tutor.js"

const prisma = new PrismaClient()

class TutorService {
  /** Lista todos os tutores com dados do usuário associado */
  async getAll() {
    const tutores = await prisma.tutor.findMany({
      include: {
        ong: {
          select: {
            id: true,
            cnpj: true,
            nome: true,
          },
        },
        pets: {
          select: {
            id: true,
            nome: true,
            status: true,
          },
        },
      },
    })
    return tutores
  }

  /** Busca um tutor por id_tutor */
  async getById(id: number) {
    const tutor = await prisma.tutor.findUnique({
      where: { id },
      include: {
        ong: true,
        pets: true,
      },
    })
    return tutor
  }

  /**
   * Cria Tutor:
   * 1) cria Usuario (forçando tipo_usuario = 'TUTOR')
   * 2) cria Tutor com endereco + FK do usuario
   */
  async create(data: ITutorCreate) {
    // basic validation for required fields to give clearer errors
    const required = ["nome", "email", "telefone", "endereco", "cidade", "estado", "cep", "idOng"] as const
    for (const key of required) {
      if ((data as any)[key] === undefined || (data as any)[key] === null) {
        throw new Error(`Missing required field: ${key}`)
      }
    }

    const tutor = await prisma.tutor.create({
      data,
      include: {
        ong: true,
      },
    })
    return tutor
  }

  /**
   * Atualiza Tutor e/ou Usuario:
   *  - campos de usuário: nome, email, senha, telefone, tipo_usuario (opcional)
   *  - campos de tutor: endereco
   */
  async update(id: number, data: ITutorUpdate) {
    const tutor = await prisma.tutor.update({
      where: { id },
      data,
      include: {
        ong: true,
        pets: true,
      },
    })
    return tutor
  }

  /**
   * Deleta Tutor.
   * Passe alsoDeleteUsuario=true para remover também o usuário associado,
   * caso não use ON DELETE CASCADE no banco.
   */
  async delete(id: number) {
    await prisma.tutor.delete({
      where: { id },
    })
  }
}

export default new TutorService()
