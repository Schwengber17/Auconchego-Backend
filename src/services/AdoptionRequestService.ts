import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class AdoptionRequestService {
  async create(petId: number, adotanteId: number, message?: string) {
    // Validar se o adotante existe
    const adotante = await prisma.adotante.findUnique({ where: { id: adotanteId } })
    if (!adotante) {
      throw new Error("Adotante não encontrado. Por favor, faça login novamente.")
    }

    // validate pet exists and is available
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) throw new Error("Pet não encontrado")
    
    if (pet.status === "ADOTADO") {
      throw new Error("Este pet já foi adotado")
    }
    
    if (pet.status === "RESERVADO") {
      throw new Error("Este pet já possui uma solicitação de adoção em análise")
    }
    
    if (pet.status !== "DISPONIVEL") {
      throw new Error("Pet não disponível para adoção no momento")
    }

    // Verificar se já existe um pedido pendente para este pet
    const existingRequest = await prisma.adoptionRequest.findFirst({
      where: {
        petId,
        status: "PENDENTE",
      },
    })
    if (existingRequest) {
      throw new Error("Já existe uma solicitação de adoção pendente para este pet")
    }

    // Criar pedido e mudar status do pet para RESERVADO em uma transação
    const req = await prisma.$transaction(async (tx) => {
      const newRequest = await tx.adoptionRequest.create({
        data: {
          petId,
          adotanteId,
          message,
        },
      })

      // Mudar status do pet para RESERVADO
      await tx.pet.update({
        where: { id: petId },
        data: { status: "RESERVADO" },
      })

      // Atualizar statusBusca do adotante para PENDENTE e petBuscado
      await tx.adotante.update({
        where: { id: adotanteId },
        data: {
          statusBusca: "PENDENTE",
          petBuscado: petId,
        },
      })

      return newRequest
    })

    return req
  }

  async getById(id: number) {
    return prisma.adoptionRequest.findUnique({ where: { id } })
  }

  async list(filters: { petId?: number; adotanteId?: number; status?: string } = {}) {
    const where: any = {}
    if (filters.petId) where.petId = Number(filters.petId)
    if (filters.adotanteId) where.adotanteId = Number(filters.adotanteId)
    if (filters.status) where.status = filters.status

    return prisma.adoptionRequest.findMany({ where, orderBy: { createdAt: "desc" } })
  }

  async approve(id: number, responderId: number, responderType: "TUTOR" | "ONG") {
    const req = await prisma.adoptionRequest.findUnique({ where: { id } })
    if (!req) throw new Error("Request not found")

    const pet = await prisma.pet.findUnique({ where: { id: req.petId } })
    if (!pet) throw new Error("Pet not found")
    // Aceitar pets DISPONIVEL ou RESERVADO (pode estar RESERVADO se já houver um pedido)
    if (pet.status !== "DISPONIVEL" && pet.status !== "RESERVADO") {
      throw new Error("Pet not available for adoption")
    }

    // authorization check without auth system: responder must match tutor origin or ong
    if (responderType === "TUTOR") {
      if (pet.tutorId !== responderId) throw new Error("Responder is not the tutor who created the pet")
    } else if (responderType === "ONG") {
      // Verificar se o pet tem ONG vinculada antes de validar
      if (!pet.idOng) throw new Error("Pet does not have an ONG associated")
      if (pet.idOng !== responderId) throw new Error("Responder is not the ONG of the pet")
    }

    // Buscar outros pedidos pendentes antes da transação
    const otherPendingRequests = await prisma.adoptionRequest.findMany({
      where: { petId: pet.id, status: "PENDENTE", id: { not: id } },
      select: { id: true, adotanteId: true },
    })

    // perform transaction: approve request, mark pet adopted, link to adotante, update adotante status, reject other pending requests
    await prisma.$transaction(async (tx) => {
      // Atualizar pedido para APROVADA
      await tx.adoptionRequest.update({
        where: { id },
        data: { status: "APROVADA", respondedAt: new Date(), responderId, responderType },
      })

      // Marcar pet como ADOTADO e vincular ao Adotante usando o novo campo idAdotante
      await tx.pet.update({
        where: { id: pet.id },
        data: { status: "ADOTADO", idAdotante: req.adotanteId },
      })

      // Atualizar statusBusca do adotante para CONCLUIDA e petBuscado
      await tx.adotante.update({
        where: { id: req.adotanteId },
        data: {
          statusBusca: "CONCLUIDA",
          petBuscado: pet.id,
        },
      })

      // Rejeitar outros pedidos pendentes para o mesmo pet
      if (otherPendingRequests.length > 0) {
        await tx.adoptionRequest.updateMany({
          where: { petId: pet.id, status: "PENDENTE", id: { not: id } },
          data: { status: "REJEITADA", respondedAt: new Date(), reason: "Pet adopted by another request" },
        })

        // Atualizar statusBusca de outros adotantes que tiveram pedidos rejeitados
        const otherAdotanteIds = otherPendingRequests.map((r) => r.adotanteId)
        if (otherAdotanteIds.length > 0) {
          await tx.adotante.updateMany({
            where: {
              id: { in: otherAdotanteIds },
              petBuscado: pet.id,
            },
            data: {
              statusBusca: "REJEITADA",
              petBuscado: null,
            },
          })
        }
      }
    })

    return this.getById(id)
  }

  async reject(id: number, responderId: number, responderType: "TUTOR" | "ONG", reason?: string) {
    const req = await prisma.adoptionRequest.findUnique({ where: { id } })
    if (!req) throw new Error("Request not found")

    const pet = await prisma.pet.findUnique({ where: { id: req.petId } })
    if (!pet) throw new Error("Pet not found")

    // Aceitar pets DISPONIVEL ou RESERVADO
    if (pet.status !== "DISPONIVEL" && pet.status !== "RESERVADO") {
      throw new Error("Pet not available for rejection")
    }

    if (responderType === "TUTOR") {
      if (pet.tutorId !== responderId) throw new Error("Responder is not the tutor who created the pet")
    } else if (responderType === "ONG") {
      // Verificar se o pet tem ONG vinculada antes de validar
      if (!pet.idOng) throw new Error("Pet does not have an ONG associated")
      if (pet.idOng !== responderId) throw new Error("Responder is not the ONG of the pet")
    }

    // Verificar se há outros pedidos pendentes para este pet
    const otherPendingRequests = await prisma.adoptionRequest.findMany({
      where: {
        petId: pet.id,
        status: "PENDENTE",
        id: { not: id },
      },
    })

    // Rejeitar pedido e atualizar status do pet e adotante em uma transação
    await prisma.$transaction(async (tx) => {
      // Marcar pedido como REJEITADA
      await tx.adoptionRequest.update({
        where: { id },
        data: { status: "REJEITADA", respondedAt: new Date(), responderId, responderType, reason },
      })

      // Se não houver outros pedidos pendentes, voltar status do pet para DISPONIVEL
      if (otherPendingRequests.length === 0) {
        await tx.pet.update({
          where: { id: pet.id },
          data: { status: "DISPONIVEL" },
        })
      }

      // Atualizar statusBusca do adotante para REJEITADA e limpar petBuscado
      await tx.adotante.update({
        where: { id: req.adotanteId },
        data: {
          statusBusca: "REJEITADA",
          petBuscado: null,
        },
      })
    })

    return this.getById(id)
  }
}

export default new AdoptionRequestService()
