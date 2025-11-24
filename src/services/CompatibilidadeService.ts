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

    let pontuacaoTotal = 0
    let fatorImpeditivo = false
    let descricaoImpeditivo = ""

    let pontoEspecie = 0
    if (pet.especie === adotante.especieDesejada) {
      pontoEspecie = 20
    } else {
      pontoEspecie = -20
    }
    pontuacaoTotal += pontoEspecie

    let pontoRaca = 0
    if (adotante.racaDesejada) {
      if (pet.raca === adotante.racaDesejada) {
        pontoRaca = 10
      } else {
        pontoRaca = -10
      }
      pontuacaoTotal += pontoRaca
    }

    let pontoPorte = 0
    if (adotante.porteDesejado) {
      if (pet.porte === adotante.porteDesejado) {
        pontoPorte = 10
      } else {
        pontoPorte = -10
      }
      pontuacaoTotal += pontoPorte
    }

    let pontoSexo = 0
    if (adotante.sexoDesejado) {
      if (pet.sexo === adotante.sexoDesejado) {
        pontoSexo = 5
      } else {
        pontoSexo = -5
      }
      pontuacaoTotal += pontoSexo
    }

    let pontoSaude = 0
    if (pet.necessidadesEspeciais || pet.tratamentoContinuo) {
      // Pet com necessidades especiais ou tratamento contínuo
      if (adotante.aceitaNecessidadesEsp || adotante.aceitaTratamentoContinuo) {
        pontoSaude = 10
      } else {
        pontoSaude = -20 // Fator impeditivo implícito
        fatorImpeditivo = true
        descricaoImpeditivo = "Adotante não aceita pets com necessidades especiais ou tratamento contínuo"
      }
    } else if (pet.doencaCronica) {
      // Pet com doença crônica
      if (adotante.aceitaDoencaCronica) {
        pontoSaude = 10
      } else {
        fatorImpeditivo = true
        descricaoImpeditivo = "Adotante não aceita pets com doença crônica incurável"
      }
    } else {
      // Pet sem problemas de saúde
      if (adotante.aceitaNecessidadesEsp || adotante.aceitaTratamentoContinuo) {
        pontoSaude = 5
      } else {
        pontoSaude = 10
      }
    }
    pontuacaoTotal += pontoSaude

    let pontoSocial = 0

    // Verificar se pet foi resgatido com outros animais (usar histórico)
    const historico = await prisma.historicoLocalizacao.findFirst({
      where: { idPet },
    })

    const petTemOutrosAnimais = historico !== null // Simplificação: se tem histórico, pode ter tido contato

    if (petTemOutrosAnimais) {
      if (adotante.temOutrosAnimais) {
        pontoSocial = 5
      }
    }

    // Disponibilidade de tempo
    if (adotante.possuiDisponibilidade) {
      pontoSocial += 5
    } else {
      fatorImpeditivo = true
      descricaoImpeditivo = "Adotante não possui disponibilidade de tempo"
    }

    pontuacaoTotal += pontoSocial

    const compatibilidade = Math.max(0, Math.min(100, (pontuacaoTotal + 100) / 2))

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
      pontoSocial,
      fatorImpeditivo,
      descricaoImpeditivo: descricaoImpeditivo || undefined,
    }

    // Salvar relatório
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

    const relatorios = []
    for (const pet of pets) {
      try {
        const relatorio = await this.calcularCompatibilidade(idAdotante, pet.id)
        relatorios.push(relatorio)
      } catch (error) {
        console.error(`Erro ao calcular compatibilidade para pet ${pet.id}:`, error)
      }
    }

    // Ordenar por compatibilidade decrescente
    relatorios.sort((a, b) => b.compatibilidade - a.compatibilidade)
    return relatorios
  }

  /**
   * Busca adotantes compatíveis para um pet
   */
  async buscarAdotantesCompativeis(idPet: number) {
    const adotantes = await prisma.adotante.findMany()

    const relatorios = []
    for (const adotante of adotantes) {
      try {
        const relatorio = await this.calcularCompatibilidade(adotante.id, idPet)
        relatorios.push(relatorio)
      } catch (error) {
        console.error(`Erro ao calcular compatibilidade para adotante ${adotante.id}:`, error)
      }
    }

    // Ordenar por compatibilidade decrescente
    relatorios.sort((a, b) => b.compatibilidade - a.compatibilidade)
    return relatorios
  }
}

export default new CompatibilidadeService()
