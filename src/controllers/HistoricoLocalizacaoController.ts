import type { Request, Response } from "express"
import HistoricoLocalizacaoService from "../services/HistoricoLocalizacaoService.js"

class HistoricoLocalizacaoController {
  async list(req: Request, res: Response) {
    try {
      const historicos = await HistoricoLocalizacaoService.getAll()
      return res.status(200).json(historicos)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: "Missing id parameter" })
      const idNum = Number.parseInt(id, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid id parameter" })
      }

      const historico = await HistoricoLocalizacaoService.getById(idNum)
      if (!historico) {
        return res.status(404).json({ error: "Histórico not found" })
      }
      return res.status(200).json(historico)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async getByPet(req: Request, res: Response) {
    try {
      const { petId } = req.params
      if (!petId) return res.status(400).json({ error: "Missing petId parameter" })
      const idNum = Number.parseInt(petId, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid petId parameter" })
      }

      const historicos = await HistoricoLocalizacaoService.getByPetId(idNum)
      return res.status(200).json(historicos)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const novo = await HistoricoLocalizacaoService.create(req.body)
      return res.status(201).json(novo)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        error: "Failed to create histórico. Check your input data.",
      })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: "Missing id parameter" })
      const idNum = Number.parseInt(id, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid id parameter" })
      }

      const atualizado = await HistoricoLocalizacaoService.update(idNum, req.body)
      return res.status(200).json(atualizado)
    } catch (error) {
      console.error(error)
      return res.status(404).json({ error: "Histórico not found or invalid data." })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: "Missing id parameter" })
      const idNum = Number.parseInt(id, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid id parameter" })
      }

      await HistoricoLocalizacaoService.delete(idNum)
      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(404).json({ error: "Histórico not found." })
    }
  }
}

export default new HistoricoLocalizacaoController()
