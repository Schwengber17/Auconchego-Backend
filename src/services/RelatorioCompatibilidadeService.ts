import { PrismaClient } from "@prisma/client"
import type { IRelatorioCompatibilidadeCreate } from "../interfaces/RelatorioCompatibilidade.js"

const prisma = new PrismaClient()

class RelatorioCompatibilidadeService {
  async getAll() {
    return await prisma.relatorioCompatibilidade.findMany({
      include: {
        adotante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            nome: true,
            especie: true,
            raca: true,
          },
        },
      },
      orderBy: {
        compatibilidade: "desc",
      },
    })
  }

  async getById(id: number) {
    return await prisma.relatorioCompatibilidade.findUnique({
      where: { id },
      include: {
        adotante: true,
        pet: true,
      },
    })
  }

  async getByAdotanteId(idAdotante: number) {
    return await prisma.relatorioCompatibilidade.findMany({
      where: { idAdotante },
      include: {
        pet: true,
      },
      orderBy: {
        compatibilidade: "desc",
      },
    })
  }

  async getByPetId(idPet: number) {
    return await prisma.relatorioCompatibilidade.findMany({
      where: { idPet },
      include: {
        adotante: true,
      },
      orderBy: {
        compatibilidade: "desc",
      },
    })
  }

  async getHighCompatibility(minScore = 60) {
    return await prisma.relatorioCompatibilidade.findMany({
      where: {
        compatibilidade: {
          gte: minScore,
        },
      },
      include: {
        adotante: true,
        pet: true,
      },
      orderBy: {
        compatibilidade: "desc",
      },
    })
  }

  async create(data: IRelatorioCompatibilidadeCreate) {
    // Verifica se já existe um relatório para este adotante e pet
    const existing = await prisma.relatorioCompatibilidade.findFirst({
      where: {
        idAdotante: data.idAdotante,
        idPet: data.idPet,
      },
    })

    if (existing) {
      // Atualiza o relatório existente
      return await prisma.relatorioCompatibilidade.update({
        where: { id: existing.id },
        data,
        include: {
          adotante: true,
          pet: true,
        },
      })
    }

    // Cria novo relatório
    return await prisma.relatorioCompatibilidade.create({
      data,
      include: {
        adotante: true,
        pet: true,
      },
    })
  }

  async delete(id: number) {
    await prisma.relatorioCompatibilidade.delete({
      where: { id },
    })
  }
}

export default new RelatorioCompatibilidadeService()
