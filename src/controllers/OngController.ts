import type { Request, Response } from 'express'
import OngService from '../services/OngService.js'

class OngController {
  async list(req: Request, res: Response) {
    try {
      const ongs = await OngService.getAll()
      return res.status(200).json(ongs)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Missing id parameter' })
      const idNum = parseInt(id, 10)
      if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' })

      const ong = await OngService.getById(idNum)
      if (!ong) return res.status(404).json({ error: 'ONG not found' })
      return res.status(200).json(ong)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const ong = await OngService.create(req.body)
      return res.status(201).json(ong)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: (error as any).message || 'Failed to create ONG' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Missing id parameter' })
      const idNum = parseInt(id, 10)
      if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' })

      const updated = await OngService.update(idNum, req.body)
      if (!updated) return res.status(404).json({ error: 'ONG not found' })
      return res.status(200).json(updated)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: 'Failed to update ONG' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Missing id parameter' })
      const idNum = parseInt(id, 10)
      if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' })

      await OngService.delete(idNum)
      return res.status(204).send()
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: 'Failed to delete ONG' })
    }
  }
}

export default new OngController()
