import { PrismaClient } from '@prisma/client';
import type { IPetCreate, IPetUpdate } from '../interfaces/Pet.js';

const prisma = new PrismaClient();

class PetService {
  async getAll(filter?: { status?: string }) {
        const where: any = {}
        if (filter && filter.status) {
            where.status = filter.status
        } else {
            // Default to only available pets for public listing
            where.status = 'DISPONIVEL'
        }

        const pets = await prisma.pet.findMany({
            where,
            include: {
                ong: {
                    select: {
                        id: true,
                        cnpj: true,
                        nome: true,
                        endereco: true,
                    }
                },
                historicoLocalizacoes: {
                    orderBy: {
                        dataInicio: 'desc'
                    },
                    take: 1
                }
            }
        });
        return pets;
    }

    async getById(id: number) {
        const pet = await prisma.pet.findUnique({
            where: { id },
             include: {
                ong: true,
                historicoLocalizacoes: {
                    orderBy: {
                        dataInicio: 'desc'
                    },
                    take: 1
                }
            }
        });
        return pet;
    }

    // Registrar novo animal
    async create(petData: IPetCreate) {
        // Ensure required date fields exist to match Prisma schema
            const data = {
                ...petData,
                dataResgate: (petData as any).dataResgate ?? new Date(),
                // Provide defaults for required boolean fields in Prisma schema
                necessidadesEspeciais: (petData as any).necessidadesEspeciais ?? false,
                tratamentoContinuo: (petData as any).tratamentoContinuo ?? false,
                doencaCronica: (petData as any).doencaCronica ?? false,
                vacinado: (petData as any).vacinado ?? false,
                castrado: (petData as any).castrado ?? false,
            }

        // If idOng provided, ensure the ONG exists to avoid FK errors
        if ((data as any).idOng) {
            const idOng = (data as any).idOng as number
            // Use a raw query to avoid depending on generated model casing
            const found: any = await prisma.$queryRaw`SELECT id_ong FROM ong WHERE id_ong = ${idOng}`
            if (!found || (Array.isArray(found) && found.length === 0)) {
                const e: any = new Error('ONG_NOT_FOUND')
                throw e
            }
        }

        const newPet = await prisma.pet.create({
            data,
        })
        return newPet
    }

    async update(id: number, petData: IPetUpdate) {
        const updatedPet = await prisma.pet.update({
            where: { id },
            data: petData,
        });
        return updatedPet;
    }

    /**
     * Mark a pet as adopted. Optionally associate the adopted pet with an adotante
     * by setting `adotante.petBuscado` and `adotante.statusBusca`.
     */
    async adopt(id: number, idAdotante?: number) {
        // ensure pet exists and is available
        const pet = await prisma.pet.findUnique({ where: { id } })
        if (!pet) throw new Error('Pet not found')
        if (pet.status !== 'DISPONIVEL') throw new Error('Pet not available for adoption')

        // Build transaction actions
        const actions: any[] = []

        actions.push(prisma.pet.update({ where: { id }, data: { status: 'ADOTADO' } }))

        if (typeof idAdotante !== 'undefined') {
            actions.push(prisma.adotante.update({ where: { id: idAdotante }, data: { petBuscado: id, statusBusca: 'CONCLUIDA' } }))
        }

        const results = await prisma.$transaction(actions)

        // Return the updated pet (first result)
        const updatedPet = await prisma.pet.findUnique({ where: { id }, include: { ong: true } })
        return updatedPet
    }

    async delete(id: number) {
        await prisma.pet.delete({
            where: { id },
        });
    }
}

export default new PetService();
