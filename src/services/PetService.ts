import { PrismaClient } from '@prisma/client'
import type { IPetCreate, IPetUpdate } from '../interfaces/Pet.js'

const prisma = new PrismaClient()

class PetService {
    async getAll(filter?: { status?: string }) {
        const where: any = {}
        if (filter && filter.status) {
            where.status = filter.status
        } else {
            // Default: só pets DISPONÍVEIS
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
                    },
                },
                historicoLocalizacoes: {
                    orderBy: {
                        dataInicio: 'desc',
                    },
                    take: 1,
                },
            },
        })
        return pets
    }

    async getById(id: number) {
        const pet = await prisma.pet.findUnique({
            where: { id },
            include: {
                ong: true,
                historicoLocalizacoes: {
                    orderBy: {
                        dataInicio: 'desc',
                    },
                    take: 1,
                },
            },
        })
        return pet
    }

    // Registrar novo animal
    async create(petData: IPetCreate) {
        // Normaliza imagens: aceita array, string única, ou nada
        const imagensNormalizadas =
            Array.isArray(petData.imagens)
                ? petData.imagens
                : typeof (petData as any).imagens === 'string'
                    ? [(petData as any).imagens]
                    : []

        // monta o objeto de dados com defaults e imagens garantidas
        const data: any = {
            ...petData,
            dataResgate: (petData as any).dataResgate ?? new Date(),
            necessidadesEspeciais: (petData as any).necessidadesEspeciais ?? false,
            tratamentoContinuo: (petData as any).tratamentoContinuo ?? false,
            doencaCronica: (petData as any).doencaCronica ?? false,
            vacinado: (petData as any).vacinado ?? false,
            castrado: (petData as any).castrado ?? false,
            imagens: imagensNormalizadas,
        }

        // Valida ONG se idOng foi enviado
        if ((data as any).idOng) {
            const idOng = (data as any).idOng as number
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

    async update(id: number, data: IPetUpdate) {
        const updateData: any = {}

        // Campos básicos
        if (typeof data.nome !== 'undefined') updateData.nome = data.nome
        if (typeof data.especie !== 'undefined') updateData.especie = data.especie
        if (typeof data.raca !== 'undefined') updateData.raca = data.raca
        if (typeof data.porte !== 'undefined') updateData.porte = data.porte
        if (typeof data.sexo !== 'undefined') updateData.sexo = data.sexo
        if (typeof data.status !== 'undefined') updateData.status = data.status

        if (typeof data.necessidadesEspeciais !== 'undefined')
            updateData.necessidadesEspeciais = data.necessidadesEspeciais
        if (typeof data.tratamentoContinuo !== 'undefined')
            updateData.tratamentoContinuo = data.tratamentoContinuo
        if (typeof data.doencaCronica !== 'undefined')
            updateData.doencaCronica = data.doencaCronica

        // Campos novos
        if (typeof data.idade !== 'undefined') updateData.idade = data.idade
        if (typeof data.peso !== 'undefined') updateData.peso = data.peso
        if (typeof data.local !== 'undefined') updateData.local = data.local
        if (typeof data.vacinado !== 'undefined') updateData.vacinado = data.vacinado
        if (typeof data.castrado !== 'undefined') updateData.castrado = data.castrado
        if (typeof data.temperamento !== 'undefined')
            updateData.temperamento = data.temperamento
        if (typeof data.descricao !== 'undefined')
            updateData.descricao = data.descricao
        if (typeof data.descricaoSaude !== 'undefined')
            updateData.descricaoSaude = data.descricaoSaude
        if (typeof data.dataResgate !== 'undefined') {
            updateData.dataResgate = data.dataResgate
                ? new Date(data.dataResgate)
                : null
        }
        if (typeof data.idTutorOrigem !== 'undefined')
            updateData.idTutorOrigem = data.idTutorOrigem
        if (typeof data.idTutorAdotante !== 'undefined')
            updateData.idTutorAdotante = data.idTutorAdotante
        if (typeof data.idOng !== 'undefined') updateData.idOng = data.idOng

        // Imagens: substitui o array inteiro
        if (typeof data.imagens !== 'undefined') {
            const imagensNormalizadas =
                Array.isArray(data.imagens)
                    ? data.imagens
                    : typeof (data as any).imagens === 'string'
                        ? [(data as any).imagens]
                        : []

            updateData.imagens = imagensNormalizadas
            // se quisesse acumular em vez de substituir:
            // updateData.imagens = { push: imagensNormalizadas }
        }

        const updated = await prisma.pet.update({
            where: { id },
            data: updateData,
            include: { ong: true },
        })

        return updated
    }

    /**
     * Mark a pet as adopted. Optionally associate the adopted pet with an adotante
     * by setting `adotante.petBuscado` and `adotante.statusBusca`.
     */
    async adopt(id: number, idAdotante?: number) {
        // ensure pet exists and is available
        const pet = await prisma.pet.findUnique({ where: { id } })
        if (!pet) throw new Error('Pet not found')
        if (pet.status !== 'DISPONIVEL')
            throw new Error('Pet not available for adoption')

        const actions: any[] = []

        actions.push(
            prisma.pet.update({ where: { id }, data: { status: 'ADOTADO' } }),
        )

        if (typeof idAdotante !== 'undefined') {
            actions.push(
                prisma.adotante.update({
                    where: { id: idAdotante },
                    data: { petBuscado: id, statusBusca: 'CONCLUIDA' },
                }),
            )
        }

        await prisma.$transaction(actions)

        const updatedPet = await prisma.pet.findUnique({
            where: { id },
            include: { ong: true },
        })
        return updatedPet
    }

    async delete(id: number) {
        await prisma.pet.delete({
            where: { id },
        })
    }
}

export default new PetService()
