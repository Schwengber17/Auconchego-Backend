import { PrismaClient } from "@prisma/client"
import type { IHistoricoLocalizacaoCreate, IHistoricoLocalizacaoUpdate } from "../interfaces/HistoricoLocalizacao.js"

const prisma = new PrismaClient()

class HistoricoLocalizacaoService {
  async getAll() {
    return await prisma.historicoLocalizacao.findMany({
      include: {
        pet: {
          select: {
            id: true,
            nome: true,
            especie: true,
          },
        },
      },
      orderBy: {
        dataInicio: "desc",
      },
    })
  }

  async getById(id: number) {
    return await prisma.historicoLocalizacao.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    })
  }

  async getByPetId(idPet: number) {
    return await prisma.historicoLocalizacao.findMany({
      where: { idPet },
      include: {
        pet: true,
      },
      orderBy: {
        dataInicio: "desc",
      },
    })
  }

  async create(data: IHistoricoLocalizacaoCreate) {
    return await prisma.historicoLocalizacao.create({
      data,
      include: {
        pet: true,
      },
    })
  }

  async update(id: number, data: IHistoricoLocalizacaoUpdate) {
    return await prisma.historicoLocalizacao.update({
      where: { id },
      data,
      include: {
        pet: true,
      },
    })
  }

  async delete(id: number) {
    await prisma.historicoLocalizacao.delete({
      where: { id },
    })
  }
}

export default new HistoricoLocalizacaoService()
