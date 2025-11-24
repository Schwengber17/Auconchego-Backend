import type { Request, Response } from "express"
import VisitaAcompanhamentoService from "../services/VisitaAcompanhamentoService.js"

class VisitaAcompanhamentoController {
  async list(req: Request, res: Response) {
    try {
      const visitas = await VisitaAcompanhamentoService.getAll()
      return res.status(200).json(visitas)
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

      const visita = await VisitaAcompanhamentoService.getById(idNum)
      if (!visita) return res.status(404).json({ error: "Visita not found" })
      return res.status(200).json(visita)
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

      const visitas = await VisitaAcompanhamentoService.getByPetId(idNum)
      return res.status(200).json(visitas)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async getByTutor(req: Request, res: Response) {
    try {
      const { tutorId } = req.params
      if (!tutorId) return res.status(400).json({ error: "Missing tutorId parameter" })
      const idNum = Number.parseInt(tutorId, 10)
      if (Number.isNaN(idNum)) {
        return res.status(400).json({ error: "Invalid tutorId parameter" })
      }

      const visitas = await VisitaAcompanhamentoService.getByTutorId(idNum)
      return res.status(200).json(visitas)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nova = await VisitaAcompanhamentoService.create(req.body)
      return res.status(201).json(nova)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        error: "Failed to create visita. Check your input data.",
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

      const atualizada = await VisitaAcompanhamentoService.update(idNum, req.body)
      return res.status(200).json(atualizada)
    } catch (error) {
      console.error(error)
      return res.status(404).json({ error: "Visita not found or invalid data." })
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

      await VisitaAcompanhamentoService.delete(idNum)
      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(404).json({ error: "Visita not found." })
    }
  }
}

export default new VisitaAcompanhamentoController()
