import { PrismaClient } from "@prisma/client"
import type { IVisitaAcompanhamentoCreate, IVisitaAcompanhamentoUpdate } from "../interfaces/VisitaAcompanhamento.js"

const prisma = new PrismaClient()

class VisitaAcompanhamentoService {
  async getAll() {
    return await prisma.visitaAcompanhamento.findMany({
      include: {
        pet: {
          select: {
            id: true,
            nome: true,
            especie: true,
          },
        },
        tutor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        ong: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        dataVisita: "desc",
      },
    })
  }

  async getById(id: number) {
    return await prisma.visitaAcompanhamento.findUnique({
      where: { id },
      include: {
        pet: true,
        tutor: true,
        ong: true,
      },
    })
  }

  async getByPetId(idPet: number) {
    return await prisma.visitaAcompanhamento.findMany({
      where: { idPet },
      include: {
        pet: true,
        tutor: true,
      },
      orderBy: {
        dataVisita: "desc",
      },
    })
  }

  async getByTutorId(idTutor: number) {
    return await prisma.visitaAcompanhamento.findMany({
      where: { idTutor },
      include: {
        pet: true,
        ong: true,
      },
      orderBy: {
        dataVisita: "desc",
      },
    })
  }

  async create(data: IVisitaAcompanhamentoCreate) {
    return await prisma.visitaAcompanhamento.create({
      data,
      include: {
        pet: true,
        tutor: true,
        ong: true,
      },
    })
  }

  async update(id: number, data: IVisitaAcompanhamentoUpdate) {
    return await prisma.visitaAcompanhamento.update({
      where: { id },
      data,
      include: {
        pet: true,
        tutor: true,
        ong: true,
      },
    })
  }

  async delete(id: number) {
    await prisma.visitaAcompanhamento.delete({
      where: { id },
    })
  }
}

export default new VisitaAcompanhamentoService()
