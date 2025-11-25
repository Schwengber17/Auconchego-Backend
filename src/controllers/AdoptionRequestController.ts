import type { Request, Response } from "express"
import AdoptionRequestService from "../services/AdoptionRequestService.js"

class AdoptionRequestController {
  async create(req: Request, res: Response) {
    try {
      const petId = Number(req.params.id)
      const { idAdotante, message } = req.body as { idAdotante?: number; message?: string }
      if (!idAdotante) return res.status(400).json({ error: "idAdotante required" })

      const created = await AdoptionRequestService.create(petId, Number(idAdotante), message)
      return res.status(201).json(created)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: (error as Error).message })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { petId, adotanteId, status } = req.query as any
      const filters: any = {}
      if (petId) filters.petId = Number(petId)
      if (adotanteId) filters.adotanteId = Number(adotanteId)
      if (status) filters.status = status

      const items = await AdoptionRequestService.list(filters)
      return res.status(200).json(items)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const item = await AdoptionRequestService.getById(id)
      if (!item) return res.status(404).json({ error: "Request not found" })
      return res.status(200).json(item)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const { responderId, responderType } = req.body as { responderId?: number; responderType?: string }
      if (!responderId || !responderType) return res.status(400).json({ error: "responderId and responderType required" })
      if (responderType !== "TUTOR" && responderType !== "ONG") return res.status(400).json({ error: "responderType must be TUTOR or ONG" })

      const updated = await AdoptionRequestService.approve(id, Number(responderId), responderType as any)
      return res.status(200).json(updated)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: (error as Error).message })
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const { responderId, responderType, reason } = req.body as { responderId?: number; responderType?: string; reason?: string }
      if (!responderId || !responderType) return res.status(400).json({ error: "responderId and responderType required" })
      if (responderType !== "TUTOR" && responderType !== "ONG") return res.status(400).json({ error: "responderType must be TUTOR or ONG" })

      const updated = await AdoptionRequestService.reject(id, Number(responderId), responderType as any, reason)
      return res.status(200).json(updated)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: (error as Error).message })
    }
  }
}

export default new AdoptionRequestController()
