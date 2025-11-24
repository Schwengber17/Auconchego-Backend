import type { Request, Response } from "express"
import RelatorioAcompanhamentoService from "../services/RelatorioAcompanhamentoService.js"

class RelatorioAcompanhamentoController {
  async gerarRelatorio(req: Request, res: Response) {
    try {
      const { idPet, idTutor, dataAdocao } = req.body

      if (!idPet || !idTutor || !dataAdocao) {
        return res.status(400).json({
          error: "Missing required fields: idPet, idTutor, dataAdocao",
        })
      }

      const data = new Date(dataAdocao)
      if (isNaN(data.getTime())) {
        return res.status(400).json({ error: "Invalid dataAdocao format" })
      }

      const relatorio = await RelatorioAcompanhamentoService.gerarRelatorioAcompanhamento(
        Number.parseInt(idPet),
        Number.parseInt(idTutor),
        data,
      )

      return res.status(200).json(relatorio)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        error: "Failed to generate follow-up report",
      })
    }
  }

  async listarPorTutor(req: Request, res: Response) {
    try {
      const { tutorId } = req.params

      if (!tutorId) {
        return res.status(400).json({ error: "Missing tutorId parameter" })
      }

      const idNum = Number.parseInt(tutorId, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid tutorId parameter" })
      }

      const relatorios = await RelatorioAcompanhamentoService.listarAcompanhamentosPorTutor(idNum)

      return res.status(200).json(relatorios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async obterAlertas(req: Request, res: Response) {
    try {
      const { dias } = req.query
      const diasSemVisita = dias ? Number.parseInt(dias as string, 10) : 30

      if (Number.isNaN(diasSemVisita)) {
        return res.status(400).json({ error: "Invalid dias parameter" })
      }

      const alertas = await RelatorioAcompanhamentoService.alertasPetsSeVisitatosAcompanhar(diasSemVisita)

      return res.status(200).json(alertas)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export default new RelatorioAcompanhamentoController()
