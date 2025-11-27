import { PrismaClient } from '@prisma/client'
import type { IPetCreate, IPetUpdate } from '../interfaces/Pet.js'

const prisma = new PrismaClient()

class PetService {
    async getAll(filter?: { status?: string }) {
        const where: any = {}
        // Se filter não foi passado ou status é undefined/vazio, retornar TODOS os pets
        if (!filter || filter.status === undefined || filter.status === '') {
            // Não adicionar filtro de status - retornar todos
        } else {
            // Filtrar por status específico
            where.status = filter.status
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
                tutorOrigem: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
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
                tutorOrigem: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
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

        // Extrair valores antes de criar o objeto data
        const tutorIdValue = (petData as any).idTutorOrigem ?? (petData as any).tutorId
        const idOngValue = (petData as any).idOng

        // monta o objeto de dados com defaults e imagens garantidas
        // Não incluir campos de relacionamento diretamente - usar sintaxe de relação do Prisma
        const data: any = {
            nome: petData.nome,
            especie: petData.especie,
            raca: petData.raca,
            porte: petData.porte,
            sexo: petData.sexo,
            status: (petData as any).status ?? 'DISPONIVEL',
            dataResgate: (petData as any).dataResgate ? new Date((petData as any).dataResgate) : new Date(),
            necessidadesEspeciais: (petData as any).necessidadesEspeciais ?? false,
            tratamentoContinuo: (petData as any).tratamentoContinuo ?? false,
            doencaCronica: (petData as any).doencaCronica ?? false,
            vacinado: (petData as any).vacinado ?? false,
            castrado: (petData as any).castrado ?? false,
            imagens: imagensNormalizadas,
            descricao: (petData as any).descricao,
            descricaoSaude: (petData as any).descricaoSaude,
            idade: (petData as any).idade,
            peso: (petData as any).peso,
            local: (petData as any).local,
            temperamento: (petData as any).temperamento ?? [],
            latitude: (petData as any).latitude,
            longitude: (petData as any).longitude,
        }

        // Validar e conectar tutor se fornecido
        if (tutorIdValue !== undefined && tutorIdValue !== null) {
            const tutorId = Number(tutorIdValue)
            if (!isNaN(tutorId)) {
                try {
                    console.log(`🔍 Validando Tutor com ID: ${tutorId}`)
                    const foundTutor = await prisma.tutor.findUnique({
                        where: { id: tutorId },
                        select: { id: true }
                    })
                    if (foundTutor) {
                        console.log(`✅ Tutor ${tutorId} validado com sucesso`)
                        ;(data as any).tutorOrigem = { connect: { id: tutorId } }
                    } else {
                        console.warn(`⚠️ Tutor com ID ${tutorId} não encontrado - criando pet sem tutor de origem`)
                        // Não lançar erro, tutor de origem é opcional
                    }
                } catch (err: any) {
                    console.warn(`⚠️ Erro ao validar tutor (ID: ${tutorId}):`, err.message)
                    // Não lançar erro, tutor de origem é opcional
                }
            }
        }

        // Valida ONG se idOng foi enviado (opcional - tutor pode não ter ONG)
        if (idOngValue !== undefined && idOngValue !== null) {
            const idOng = Number(idOngValue)
            if (isNaN(idOng)) {
                console.warn(`⚠️ idOng inválido: ${idOngValue} - criando pet sem ONG`)
                // Não lançar erro, apenas criar sem ONG
            } else {
                // Usar Prisma ORM em vez de queryRaw para melhor compatibilidade
                try {
                    console.log(`🔍 Validando ONG com ID: ${idOng}`)
                    const found = await prisma.oNG.findUnique({
                        where: { id: idOng },
                        select: { id: true }
                    })
                    console.log(`🔍 Resultado da busca:`, found)
                    if (found) {
                        console.log(`✅ ONG ${idOng} validada com sucesso`)
                        // Usar sintaxe de relação do Prisma
                        ;(data as any).ong = { connect: { id: idOng } }
                    } else {
                        console.warn(`⚠️ ONG com ID ${idOng} não encontrada - criando pet sem ONG (opcional)`)
                        // Não lançar erro, apenas criar sem ONG já que é opcional
                    }
                } catch (err: any) {
                    console.warn(`⚠️ Erro ao validar ONG (ID: ${idOng}):`, err.message, '- criando pet sem ONG')
                    // Não lançar erro, apenas criar sem ONG já que é opcional
                }
            }
        }
        // Se idOng não foi enviado, não é erro - tutor pode não ter ONG vinculada

        // Log final do objeto data antes de criar
        console.log('📤 Dados finais para criar pet:', JSON.stringify(data, null, 2))
        console.log('📤 tutorOrigem no data:', (data as any).tutorOrigem)
        console.log('📤 ong no data:', (data as any).ong)

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
        if (typeof (data as any).latitude !== 'undefined') updateData.latitude = (data as any).latitude
        if (typeof (data as any).longitude !== 'undefined') updateData.longitude = (data as any).longitude
        if (typeof data.descricao !== 'undefined')
            updateData.descricao = data.descricao
        if (typeof data.descricaoSaude !== 'undefined')
            updateData.descricaoSaude = data.descricaoSaude
        if (typeof data.dataResgate !== 'undefined') {
            updateData.dataResgate = data.dataResgate
                ? new Date(data.dataResgate)
                : null
        }
        // Mapear tutorId/adotanteId para os campos do Prisma
        if (typeof data.tutorId !== 'undefined')
            updateData.tutorId = data.tutorId
        else if (typeof (data as any).idTutorOrigem !== 'undefined')
            updateData.tutorId = (data as any).idTutorOrigem
        
        if (typeof data.adotanteId !== 'undefined')
            updateData.adotanteId = data.adotanteId
        else if (typeof (data as any).idTutorAdotante !== 'undefined')
            updateData.adotanteId = (data as any).idTutorAdotante
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
