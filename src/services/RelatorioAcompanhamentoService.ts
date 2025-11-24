import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface IRelatorioAcompanhamento {
  idPet: number
  idTutor: number
  dataAdocao: Date
  diasAcompanhamento: number
  totalVisitas: number
  vacinado: boolean
  castrado: boolean
  ultimaVacina?: Date
  ultimaVisita?: Date
  incidentesSaude: string[]
  observacoesGerais: string
  statusAcompanhamento: "ACOMPANHANDO" | "CONCLUIDO" | "PROBLEMATICO"
}

class RelatorioAcompanhamentoService {
  /**
   * Gera relatório de acompanhamento pós-adoção para um pet
   * Considera período de até 6 meses após adoção
   */
  async gerarRelatorioAcompanhamento(
    idPet: number,
    idTutor: number,
    dataAdocao: Date,
  ): Promise<IRelatorioAcompanhamento> {
    const visitas = await prisma.visitaAcompanhamento.findMany({
      where: {
        idPet,
        idTutor,
        dataVisita: {
          gte: dataAdocao,
          lte: new Date(dataAdocao.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 meses
        },
      },
      orderBy: {
        dataVisita: "desc",
      },
    })

    const totalVisitas = visitas.length
    const ultimaVisita = visitas.length > 0 ? visitas[0].dataVisita : undefined

    let vacinado = false
    let castrado = false
    let ultimaVacina: Date | undefined
    const incidentesSaude: string[] = []

    visitas.forEach((visita) => {
      if (visita.vacinado) vacinado = true
      if (visita.castrado) castrado = true
      if (visita.vacinado && !ultimaVacina) {
        ultimaVacina = visita.dataVisita
      }
      if (visita.descricaoSaude) {
        incidentesSaude.push(`${visita.dataVisita.toLocaleDateString()}: ${visita.descricaoSaude}`)
      }
    })

    let statusAcompanhamento: "ACOMPANHANDO" | "CONCLUIDO" | "PROBLEMATICO" = "ACOMPANHANDO"
    const agora = new Date()
    const diasDesdeAdocao = Math.floor((agora.getTime() - dataAdocao.getTime()) / (1000 * 60 * 60 * 24))

    if (diasDesdeAdocao >= 180) {
      // 6 meses
      statusAcompanhamento = "CONCLUIDO"
    } else if (incidentesSaude.length > 3) {
      statusAcompanhamento = "PROBLEMATICO"
    }

    let observacoesGerais = ""
    if (totalVisitas === 0) {
      observacoesGerais = "Nenhuma visita de acompanhamento registrada ainda."
    } else if (vacinado && castrado) {
      observacoesGerais = "Pet em excelente situação de saúde com vacinação e castração em dia."
    } else if (incidentesSaude.length > 0) {
      observacoesGerais = `Pet apresentou ${incidentesSaude.length} incidente(s) de saúde durante o período de acompanhamento.`
    } else {
      observacoesGerais = "Pet está adaptando-se bem ao novo lar."
    }

    return {
      idPet,
      idTutor,
      dataAdocao,
      diasAcompanhamento: diasDesdeAdocao,
      totalVisitas,
      vacinado,
      castrado,
      ultimaVacina,
      ultimaVisita,
      incidentesSaude,
      observacoesGerais,
      statusAcompanhamento,
    }
  }

  /**
   * Lista relatórios de acompanhamento para um tutor adotante
   */
  async listarAcompanhamentosPorTutor(idTutor: number) {
    const petsAdotados = await prisma.pet.findMany({
      where: {
        idTutorAdotante: idTutor,
      },
    })

    const relatorios = []
    for (const pet of petsAdotados) {
      const dataAdocao = pet.dataCadastro // Usar data de cadastro como data de adoção
      try {
        const relatorio = await this.gerarRelatorioAcompanhamento(pet.id, idTutor, dataAdocao)
        relatorios.push(relatorio)
      } catch (error) {
        console.error(`Erro ao gerar relatório para pet ${pet.id}:`, error)
      }
    }

    return relatorios
  }

  /**
   * Alertas para acompanhamento - pets que não tiveram visitas recentemente
   */
  async alertasPetsSeVisitatosAcompanhar(diasSemVista = 30) {
    const dataLimite = new Date(Date.now() - diasSemVista * 24 * 60 * 60 * 1000)

    const petsComProblema = await prisma.pet.findMany({
      where: {
        status: "ADOTADO",
        visitasAcompanhamento: {
          none: {
            dataVisita: {
              gte: dataLimite,
            },
          },
        },
      },
      include: {
        tutorAdotante: true,
      },
    })

    return petsComProblema.map((pet) => ({
      idPet: pet.id,
      nomePet: pet.nome,
      idTutorAdotante: pet.idTutorAdotante,
      tutorAdotante: pet.tutorAdotante?.nome || "Desconhecido",
      mensagem: `Pet ${pet.nome} não possui visita de acompanhamento há mais de ${diasSemVista} dias.`,
    }))
  }
}

export default new RelatorioAcompanhamentoService()
