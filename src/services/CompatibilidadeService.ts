import { PrismaClient } from "@prisma/client"
import type { IRelatorioCompatibilidade } from "../interfaces/RelatorioCompatibilidade.js"
import RelatorioCompatibilidadeService from "./RelatorioCompatibilidadeService.js"

const prisma = new PrismaClient()

class CompatibilidadeService {
    /**
     * Calcula compatibilidade entre adotante e pet com algoritmo aprimorado
     * Retorna objeto com pontuação detalhada e fator impeditivo
     */
    async calcularCompatibilidade(idAdotante: number, idPet: number) {
        const adotante = await prisma.adotante.findUnique({
            where: { id: idAdotante },
        })
        const pet = await prisma.pet.findUnique({
            where: { id: idPet },
            include: {
                ong: true,
            },
        })

        if (!adotante || !pet) {
            throw new Error("Adotante ou Pet não encontrado")
        }

        // Componentes da pontuação
        let fatorImpeditivo = false
        let descricaoImpeditivo = ""

        const components: { value: number; min: number; max: number; key: string }[] = []

        // === ESPÉCIE (20 pontos) ===
        if (adotante.especieDesejada) {
            const pontoEspecie = pet.especie === adotante.especieDesejada ? 20 : -20
            components.push({ value: pontoEspecie, min: -20, max: 20, key: "pontoEspecie" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoEspecie" })
        }

        // === RAÇA (10 pontos) ===
        if (adotante.racaDesejada) {
            const pontoRaca = pet.raca === adotante.racaDesejada ? 10 : -5
            components.push({ value: pontoRaca, min: -5, max: 10, key: "pontoRaca" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoRaca" })
        }

        // === PORTE (10 pontos) ===
        if (adotante.porteDesejado) {
            const pontoPorte = pet.porte === adotante.porteDesejado ? 10 : -5
            components.push({ value: pontoPorte, min: -5, max: 10, key: "pontoPorte" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoPorte" })
        }

        // === SEXO (5 pontos) ===
        if (adotante.sexoDesejado) {
            const pontoSexo = pet.sexo === adotante.sexoDesejado ? 5 : -3
            components.push({ value: pontoSexo, min: -3, max: 5, key: "pontoSexo" })
        } else {
            components.push({ value: 0, min: 0, max: 0, key: "pontoSexo" })
        }

        // === IDADE (8 pontos) ===
        let pontoIdade = 0
        let idadeMin = 0
        let idadeMax = 8

        if (adotante.idadeMinima !== null && adotante.idadeMaxima !== null && pet.idade !== null) {
            if (pet.idade >= adotante.idadeMinima && pet.idade <= adotante.idadeMaxima) {
                pontoIdade = 8
            } else if (pet.idade < adotante.idadeMinima) {
                // Muito novo - penalização menor
                pontoIdade = -3
            } else {
                // Muito velho - penalização maior
                pontoIdade = -5
            }
        } else if (adotante.idadeMinima !== null && pet.idade !== null) {
            // Só tem mínimo
            if (pet.idade >= adotante.idadeMinima) {
                pontoIdade = 5
            } else {
                pontoIdade = -3
            }
        } else if (adotante.idadeMaxima !== null && pet.idade !== null) {
            // Só tem máximo
            if (pet.idade <= adotante.idadeMaxima) {
                pontoIdade = 5
            } else {
                pontoIdade = -5
            }
        } else {
            // Sem preferência de idade
            idadeMin = 0
            idadeMax = 0
        }

        components.push({ value: pontoIdade, min: idadeMin, max: idadeMax, key: "pontoIdade" })

        // === PESO (8 pontos) ===
        let pontoPeso = 0
        let pesoMin = 0
        let pesoMax = 8

        if (adotante.pesoMinimo !== null && adotante.pesoMaximo !== null && pet.peso !== null) {
            if (pet.peso >= adotante.pesoMinimo && pet.peso <= adotante.pesoMaximo) {
                pontoPeso = 8
            } else if (pet.peso < adotante.pesoMinimo) {
                pontoPeso = -3
            } else {
                pontoPeso = -5
            }
        } else if (adotante.pesoMinimo !== null && pet.peso !== null) {
            if (pet.peso >= adotante.pesoMinimo) {
                pontoPeso = 5
            } else {
                pontoPeso = -3
            }
        } else if (adotante.pesoMaximo !== null && pet.peso !== null) {
            if (pet.peso <= adotante.pesoMaximo) {
                pontoPeso = 5
            } else {
                pontoPeso = -5
            }
        } else {
            pesoMin = 0
            pesoMax = 0
        }

        components.push({ value: pontoPeso, min: pesoMin, max: pesoMax, key: "pontoPeso" })

        // === SAÚDE (15 pontos) ===
        let pontoSaude = 0
        let saudeMin = 0
        let saudeMax = 15

        if (pet.necessidadesEspeciais || pet.tratamentoContinuo) {
            saudeMin = -20
            saudeMax = 15

            if (adotante.aceitaNecessidadesEsp || adotante.aceitaTratamentoContinuo) {
                pontoSaude = 15
            } else {
                pontoSaude = -20
                fatorImpeditivo = true
                descricaoImpeditivo = "Adotante não aceita pets com necessidades especiais ou tratamento contínuo"
            }
        } else if (pet.doencaCronica) {
            saudeMin = -20
            saudeMax = 15

            if (adotante.aceitaDoencaCronica) {
                pontoSaude = 15
            } else {
                pontoSaude = -20
                fatorImpeditivo = true
                descricaoImpeditivo = "Adotante não aceita pets com doença crônica incurável"
            }
        } else {
            // Pet saudável
            saudeMin = 5
            saudeMax = 15
            pontoSaude = 15
        }

        components.push({ value: pontoSaude, min: saudeMin, max: saudeMax, key: "pontoSaude" })

        // === VACINAÇÃO (5 pontos) ===
        let pontoVacinacao = 0
        let vacinacaoMin = 0
        let vacinacaoMax = 5

        if (adotante.preferVacinado !== null && adotante.preferVacinado !== undefined) {
            if (adotante.preferVacinado) {
                // Prefere vacinado
                if (pet.vacinado) {
                    pontoVacinacao = 5
                } else {
                    pontoVacinacao = -5
                }
            } else {
                // Não se importa com vacinação
                vacinacaoMin = 0
                vacinacaoMax = 0
            }
        } else {
            vacinacaoMin = 0
            vacinacaoMax = 0
        }

        components.push({ value: pontoVacinacao, min: vacinacaoMin, max: vacinacaoMax, key: "pontoVacinacao" })

        // === CASTRAÇÃO (5 pontos) ===
        let pontoCastracao = 0
        let castracaoMin = 0
        let castracaoMax = 5

        if (adotante.preferCastrado !== null && adotante.preferCastrado !== undefined) {
            if (adotante.preferCastrado) {
                // Prefere castrado
                if (pet.castrado) {
                    pontoCastracao = 5
                } else {
                    pontoCastracao = -5
                }
            } else {
                castracaoMin = 0
                castracaoMax = 0
            }
        } else {
            castracaoMin = 0
            castracaoMax = 0
        }

        components.push({ value: pontoCastracao, min: castracaoMin, max: castracaoMax, key: "pontoCastracao" })

        // === TEMPERAMENTO (8 pontos) ===
        let pontoTemperamento = 0
        let temperamentoMin = 0
        let temperamentoMax = 8

        if (adotante.preferTemperamento && adotante.preferTemperamento.length > 0 && pet.temperamento && pet.temperamento.length > 0) {
            // Conta quantos temperamentos do pet correspondem às preferências
            const matches = pet.temperamento.filter(t => 
                adotante.preferTemperamento!.some(p => 
                    t.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(t.toLowerCase())
                )
            ).length

            if (matches > 0) {
                // Proporcional ao número de matches
                pontoTemperamento = Math.min(8, matches * 3)
            } else {
                pontoTemperamento = -3
            }
        } else {
            temperamentoMin = 0
            temperamentoMax = 0
        }

        components.push({ value: pontoTemperamento, min: temperamentoMin, max: temperamentoMax, key: "pontoTemperamento" })

        // === LOCALIZAÇÃO (5 pontos) ===
        let pontoLocalizacao = 0
        let localizacaoMin = 0
        let localizacaoMax = 5

        if (adotante.preferLocalizacao && pet.local) {
            const preferLower = adotante.preferLocalizacao.toLowerCase()
            const petLocalLower = pet.local.toLowerCase()

            if (petLocalLower.includes(preferLower) || preferLower.includes(petLocalLower)) {
                pontoLocalizacao = 5
            } else {
                // Verifica se é o mesmo estado
                const adotanteEstado = adotante.estado?.toLowerCase()
                const petLocalEstado = pet.local.toLowerCase()

                if (adotanteEstado && petLocalEstado.includes(adotanteEstado)) {
                    pontoLocalizacao = 2
                } else {
                    pontoLocalizacao = -2
                }
            }
        } else {
            localizacaoMin = 0
            localizacaoMax = 0
        }

        components.push({ value: pontoLocalizacao, min: localizacaoMin, max: localizacaoMax, key: "pontoLocalizacao" })

        // === AMBIENTE E ESTILO DE VIDA (12 pontos) ===
        let pontoAmbiente = 0
        let ambienteMin = -10
        let ambienteMax = 12

        // Tipo de moradia vs porte do pet
        if (adotante.tipoMoradia) {
            if (adotante.tipoMoradia === "apartamento") {
                // Apartamento: melhor para pets pequenos
                if (pet.porte === "PEQUENO") {
                    pontoAmbiente += 5
                } else if (pet.porte === "MEDIO") {
                    pontoAmbiente += 2
                } else {
                    pontoAmbiente -= 3
                }
            } else if (adotante.tipoMoradia === "casa") {
                // Casa: aceita todos os portes
                pontoAmbiente += 3
            } else if (adotante.tipoMoradia === "chacara") {
                // Chácara: ideal para pets grandes e ativos
                if (pet.porte === "GRANDE") {
                    pontoAmbiente += 5
                } else {
                    pontoAmbiente += 2
                }
            }
        }

        // Tempo em casa vs necessidades do pet
        if (adotante.tempoCasa) {
            if (adotante.tempoCasa === "alto") {
                // Muito tempo em casa: ideal para pets que precisam de atenção
                if (pet.necessidadesEspeciais || pet.tratamentoContinuo) {
                    pontoAmbiente += 4
                } else {
                    pontoAmbiente += 2
                }
            } else if (adotante.tempoCasa === "medio") {
                pontoAmbiente += 2
            } else {
                // Pouco tempo: penalização para pets com necessidades especiais
                if (pet.necessidadesEspeciais || pet.tratamentoContinuo) {
                    pontoAmbiente -= 5
                }
            }
        }

        // Experiência com pets
        if (adotante.experiencia) {
            // Tem experiência: pode lidar melhor com pets com necessidades
            if (pet.necessidadesEspeciais || pet.tratamentoContinuo || pet.doencaCronica) {
                pontoAmbiente += 3
            } else {
                pontoAmbiente += 1
            }
        } else {
            // Sem experiência: melhor para pets mais fáceis
            if (pet.necessidadesEspeciais || pet.tratamentoContinuo || pet.doencaCronica) {
                pontoAmbiente -= 2
            }
        }

        components.push({ value: pontoAmbiente, min: ambienteMin, max: ambienteMax, key: "pontoAmbiente" })

        // === SOCIAL / DISPONIBILIDADE (10 pontos) ===
        const historico = await prisma.historicoLocalizacao.findFirst({ where: { idPet: pet.id } })
        const petTemOutrosAnimais = historico !== null

        let pontoSocial = 0
        let socialMin = -20
        let socialMax = 10

        // Compatibilidade com outros animais
        if (petTemOutrosAnimais && adotante.temOutrosAnimais) {
            pontoSocial += 5
        } else if (petTemOutrosAnimais && !adotante.temOutrosAnimais) {
            // Pet acostumado com outros, mas adotante não tem - pode ser positivo
            pontoSocial += 2
        }

        // Disponibilidade de tempo
        if (adotante.possuiDisponibilidade) {
            pontoSocial += 5
        } else {
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
            compatibilidade = 50
        } else {
            const raw = ((pontuacaoTotal - minPossible) / (maxPossible - minPossible)) * 100
            compatibilidade = Math.max(0, Math.min(100, Math.round(raw)))
        }

        // Aplica penalização se houver fator impeditivo
        if (fatorImpeditivo) {
            compatibilidade = Math.min(compatibilidade, 20)
        }

        // Mapeia componentes de volta para campos nomeados
        const pontoEspecie = components.find((c) => c.key === "pontoEspecie")?.value ?? 0
        const pontoRaca = components.find((c) => c.key === "pontoRaca")?.value ?? 0
        const pontoPorte = components.find((c) => c.key === "pontoPorte")?.value ?? 0
        const pontoSexo = components.find((c) => c.key === "pontoSexo")?.value ?? 0
        // pontoSaude já foi declarado acima, então usamos diretamente
        const pontoSocialComp = components.find((c) => c.key === "pontoSocial")?.value ?? 0
        const pontoIdadeComp = components.find((c) => c.key === "pontoIdade")?.value ?? 0
        const pontoPesoComp = components.find((c) => c.key === "pontoPeso")?.value ?? 0
        const pontoVacinacaoComp = components.find((c) => c.key === "pontoVacinacao")?.value ?? 0
        const pontoCastracaoComp = components.find((c) => c.key === "pontoCastracao")?.value ?? 0
        const pontoTemperamentoComp = components.find((c) => c.key === "pontoTemperamento")?.value ?? 0
        const pontoLocalizacaoComp = components.find((c) => c.key === "pontoLocalizacao")?.value ?? 0
        const pontoAmbienteComp = components.find((c) => c.key === "pontoAmbiente")?.value ?? 0

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
            pontoIdade: pontoIdadeComp,
            pontoPeso: pontoPesoComp,
            pontoVacinacao: pontoVacinacaoComp,
            pontoCastracao: pontoCastracaoComp,
            pontoTemperamento: pontoTemperamentoComp,
            pontoLocalizacao: pontoLocalizacaoComp,
            pontoAmbiente: pontoAmbienteComp,
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
            include: {
                ong: true,
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
