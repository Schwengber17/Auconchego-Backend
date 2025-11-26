import { PrismaClient } from "@prisma/client"
import type { IRelatorioCompatibilidade } from "../interfaces/RelatorioCompatibilidade.js"
import RelatorioCompatibilidadeService from "./RelatorioCompatibilidadeService.js"

const prisma = new PrismaClient()

class CompatibilidadeService {
    /**
     * Calcula compatibilidade entre adotante e pet seguindo a metodologia do escopo
     * Retorna objeto com pontuação detalhada e fator impeditivo
     */
    async calcularCompatibilidade(idAdotante: number, idPet: number) {
        const adotante = await prisma.adotante.findUnique({
            where: { id: idAdotante },
        })
        const pet = await prisma.pet.findUnique({
            where: { id: idPet },
        })

        if (!adotante || !pet) {
            throw new Error("Adotante ou Pet não encontrado")
        }

        // Componentes da pontuação
        let fatorImpeditivo = false
        let descricaoImpeditivo = ""

        const components: { value: number; min: number; max: number; key: string }[] = []

        // === ESPÉCIE ===
        // Só pontua se o adotante tiver preferência
        if (adotante.especieDesejada) {
            const pontoEspecie = pet.especie === adotante.especieDesejada ? 20 : -20
            components.push({ value: pontoEspecie, min: -20, max: 20, key: "pontoEspecie" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoEspecie" })
        }

        // === RAÇA ===
        if (adotante.racaDesejada) {
            const pontoRaca = pet.raca === adotante.racaDesejada ? 10 : -10
            components.push({ value: pontoRaca, min: -10, max: 10, key: "pontoRaca" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoRaca" })
        }

        // === PORTE ===
        if (adotante.porteDesejado) {
            const pontoPorte = pet.porte === adotante.porteDesejado ? 10 : -10
            components.push({ value: pontoPorte, min: -10, max: 10, key: "pontoPorte" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoPorte" })
        }

        // === SEXO ===
        if (adotante.sexoDesejado) {
            const pontoSexo = pet.sexo === adotante.sexoDesejado ? 5 : -5
            components.push({ value: pontoSexo, min: -5, max: 5, key: "pontoSexo" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoSexo" })
        }

        // === SAÚDE ===
        let pontoSaude = 0
        let saudeMin = 0
        let saudeMax = 0

        if (pet.necessidadesEspeciais || pet.tratamentoContinuo) {
            // Pet com necessidades especiais ou tratamento contínuo
            saudeMin = -20
            saudeMax = 10

            if (adotante.aceitaNecessidadesEsp || adotante.aceitaTratamentoContinuo) {
                pontoSaude = 10
            } else {
                pontoSaude = -20
                fatorImpeditivo = true
                descricaoImpeditivo = "Adotante não aceita pets com necessidades especiais ou tratamento contínuo"
            }
        } else if (pet.doencaCronica) {
            // Pet com doença crônica incurável
            saudeMin = -20
            saudeMax = 10

            if (adotante.aceitaDoencaCronica) {
                pontoSaude = 10
            } else {
                pontoSaude = -20
                fatorImpeditivo = true
                descricaoImpeditivo = "Adotante não aceita pets com doença crônica incurável"
            }
        } else {
            // Pet sem problemas de saúde relevantes
            // Aqui a saúde sempre puxa pra cima, o que é ok
            saudeMin = 5
            saudeMax = 10

            if (adotante.aceitaNecessidadesEsp || adotante.aceitaTratamentoContinuo) {
                pontoSaude = 5
            } else {
                pontoSaude = 10
            }
        }

        components.push({ value: pontoSaude, min: saudeMin, max: saudeMax, key: "pontoSaude" })

        // === SOCIAL / DISPONIBILIDADE ===
        const historico = await prisma.historicoLocalizacao.findFirst({ where: { idPet } })
        const petTemOutrosAnimais = historico !== null

        let pontoSocial = 0
        // Vamos considerar um range mais forte aqui:
        // pior caso -20 (sem disponibilidade) até +10 (tem outros animais + disponibilidade)
        let socialMin = -20
        let socialMax = 10

        // se o pet tem histórico, interpretamos como “convive/conviveu com outros animais/ambientes”
        if (petTemOutrosAnimais && adotante.temOutrosAnimais) {
            pontoSocial += 5
        }

        if (adotante.possuiDisponibilidade) {
            pontoSocial += 5
        } else {
            // Falta de disponibilidade é quase impeditiva
            pontoSocial -= 20
            fatorImpeditivo = true
            descricaoImpeditivo = "Adotante não possui disponibilidade de tempo"
        }

        components.push({ value: pontoSocial, min: socialMin, max: socialMax, key: "pontoSocial" })

        // === AGREGAÇÃO ===
        const pontuacaoTotal = components.reduce((s, c) => s + c.value, 0)
        const minPossible = components.reduce((s, c) => s + c.min, 0)
        const maxPossible = components.reduce((s, c) => s + c.max, 0)

        // Normaliza para 0–100 considerando apenas os critérios aplicáveis
        let compatibilidade = 0

        if (maxPossible === minPossible) {
            // Caso extremo: nada pra comparar, neutro
            compatibilidade = 50
        } else {
            const raw = ((pontuacaoTotal - minPossible) / (maxPossible - minPossible)) * 100
            compatibilidade = Math.max(0, Math.min(100, Math.round(raw)))
        }

        // Aplica penalização se houver fator impeditivo
        if (fatorImpeditivo) {
            // opção mais suave: nunca passa de 20% se tiver impeditivo
            compatibilidade = Math.min(compatibilidade, 20)

            // se quiser ser mais rígido: zera de vez
            // compatibilidade = 0
        }

        // Mapeia componentes de volta para campos nomeados
        const pontoEspecie = components.find((c) => c.key === "pontoEspecie")?.value ?? 0
        const pontoRaca = components.find((c) => c.key === "pontoRaca")?.value ?? 0
        const pontoPorte = components.find((c) => c.key === "pontoPorte")?.value ?? 0
        const pontoSexo = components.find((c) => c.key === "pontoSexo")?.value ?? 0
        const pontoSocialComp = components.find((c) => c.key === "pontoSocial")?.value ?? 0

        const relatorio: Omit<IRelatorioCompatibilidade, "id" | "dataCriacaoRelatorio"> = {
            idAdotante,
            idPet,
            pontuacaoTotal,
            compatibilidade,
            pontoEspecie,
            pontoRaca,
            pontoPorte,
            pontoSexo,
            pontoSaude,
            pontoSocial: pontoSocialComp,
            fatorImpeditivo,
            descricaoImpeditivo: descricaoImpeditivo || undefined,
        }

        // Salva relatório
        const saved = await RelatorioCompatibilidadeService.create(relatorio as any)
        return saved
    }

    /**
     * Busca pets compatíveis para um adotante (retorna ranking)
     */
    async buscarPetsCompativeis(idAdotante: number) {
        const pets = await prisma.pet.findMany({
            where: {
                status: "DISPONIVEL",
            },
        })

        const relatorios: IRelatorioCompatibilidade[] = []

        for (const pet of pets) {
            try {
                const relatorio = await this.calcularCompatibilidade(idAdotante, pet.id)
                relatorios.push(relatorio)
            } catch (error) {
                console.error(`Erro ao calcular compatibilidade para pet ${pet.id}:`, error)
            }
        }

        // Ordena por compatibilidade decrescente
        relatorios.sort((a, b) => b.compatibilidade - a.compatibilidade)
        return relatorios
    }

    /**
     * Busca adotantes compatíveis para um pet
     */
    async buscarAdotantesCompativeis(idPet: number) {
        const adotantes = await prisma.adotante.findMany()

        const relatorios: IRelatorioCompatibilidade[] = []

        for (const adotante of adotantes) {
            try {
                const relatorio = await this.calcularCompatibilidade(adotante.id, idPet)
                relatorios.push(relatorio)
            } catch (error) {
                console.error(`Erro ao calcular compatibilidade para adotante ${adotante.id}:`, error)
            }
        }

        // Ordena por compatibilidade decrescente
        relatorios.sort((a, b) => b.compatibilidade - a.compatibilidade)
        return relatorios
    }
}

export default new CompatibilidadeService()
