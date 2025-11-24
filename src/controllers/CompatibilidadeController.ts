import type { Request, Response } from "express"
import CompatibilidadeService from "../services/CompatibilidadeService.js"
import RelatorioCompatibilidadeService from "../services/RelatorioCompatibilidadeService.js"

class CompatibilidadeController {
  async calcular(req: Request, res: Response) {
    try {
      const { idAdotante, idPet } = req.body
      if (!idAdotante || !idPet) {
        return res.status(400).json({
          error: "Missing idAdotante or idPet in request body",
        })
      }

      const relatorio = await CompatibilidadeService.calcularCompatibilidade(idAdotante, idPet)
      return res.status(201).json(relatorio)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        error: "Failed to calculate compatibility",
      })
    }
  }

  async buscarPetsCompativeis(req: Request, res: Response) {
    try {
      const { idAdotante } = req.params
      if (!idAdotante) {
        return res.status(400).json({ error: "Missing idAdotante parameter" })
      }

      const idNum = Number.parseInt(idAdotante, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid idAdotante parameter" })
      }

      const relatorios = await CompatibilidadeService.buscarPetsCompativeis(idNum)
      return res.status(200).json(relatorios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async buscarAdotantesCompativeis(req: Request, res: Response) {
    try {
      const { idPet } = req.params
      if (!idPet) {
        return res.status(400).json({ error: "Missing idPet parameter" })
      }

      const idNum = Number.parseInt(idPet, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid idPet parameter" })
      }

      const relatorios = await CompatibilidadeService.buscarAdotantesCompativeis(idNum)
      return res.status(200).json(relatorios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async listarRelatorios(req: Request, res: Response) {
    try {
      const relatorios = await RelatorioCompatibilidadeService.getAll()
      return res.status(200).json(relatorios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async obterAltoCompatibilidade(req: Request, res: Response) {
    try {
      const { minScore } = req.query
      const minScoreNum = minScore ? Number.parseInt(minScore as string, 10) : 60

      const relatorios = await RelatorioCompatibilidadeService.getHighCompatibility(minScoreNum)
      return res.status(200).json(relatorios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export default new CompatibilidadeController()
