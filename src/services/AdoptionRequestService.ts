import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class AdoptionRequestService {
  async create(petId: number, adotanteId: number, message?: string) {
    // validate pet exists and is available
    const pet = await prisma.pet.findUnique({ where: { id: petId } })
    if (!pet) throw new Error("Pet not found")
    if (pet.status !== "DISPONIVEL") throw new Error("Pet not available for adoption")

    const req = await prisma.adoptionRequest.create({
      data: {
        petId,
        adotanteId,
        message,
      },
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
    if (pet.status !== "DISPONIVEL") throw new Error("Pet not available")

    // authorization check without auth system: responder must match tutor origin or ong
    if (responderType === "TUTOR") {
      if (pet.tutorId !== responderId) throw new Error("Responder is not the tutor who created the pet")
    } else if (responderType === "ONG") {
      if (pet.idOng !== responderId) throw new Error("Responder is not the ONG of the pet")
    }

    // perform transaction: approve request, mark pet adopted, reject other pending requests
    await prisma.$transaction([
      prisma.adoptionRequest.update({ where: { id }, data: { status: "APROVADA", respondedAt: new Date(), responderId, responderType } }),
      prisma.pet.update({ where: { id: pet.id }, data: { status: "ADOTADO", adotanteId: req.adotanteId } }),
      prisma.adoptionRequest.updateMany({ where: { petId: pet.id, status: "PENDENTE", id: { not: id } }, data: { status: "REJEITADA", respondedAt: new Date(), reason: "Pet adopted by another request" } }),
    ])

    return this.getById(id)
  }

  async reject(id: number, responderId: number, responderType: "TUTOR" | "ONG", reason?: string) {
    const req = await prisma.adoptionRequest.findUnique({ where: { id } })
    if (!req) throw new Error("Request not found")

    const pet = await prisma.pet.findUnique({ where: { id: req.petId } })
    if (!pet) throw new Error("Pet not found")

    if (responderType === "TUTOR") {
      if (pet.idTutorOrigem !== responderId) throw new Error("Responder is not the tutor who created the pet")
    } else if (responderType === "ONG") {
      if (pet.idOng !== responderId) throw new Error("Responder is not the ONG of the pet")
    }

    const updated = await prisma.adoptionRequest.update({ where: { id }, data: { status: "REJEITADA", respondedAt: new Date(), responderId, responderType, reason } })
    return updated
  }
}

export default new AdoptionRequestService()
