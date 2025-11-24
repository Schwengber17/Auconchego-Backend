// src/controllers/AdotanteController.ts
import type { Request, Response } from "express";
import AdotanteService from "../services/AdotanteService.js";
import PetService from "../services/PetService.js";
import { ENUM_STATUS } from '../utils/constants.js'

class AdotanteController {
    async list(req: Request, res: Response) {
        try {
            const adotantes = await AdotanteService.getAll();
            return res.status(200).json(adotantes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing id parameter" });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) {
                return res.status(400).json({ error: "Invalid id parameter" });
            }

            const adotante = await AdotanteService.getById(idNum);
            if (!adotante) return res.status(404).json({ error: "Adotante not found" });
            return res.status(200).json(adotante);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const novo = await AdotanteService.create(req.body);
            return res.status(201).json(novo);
        } catch (error) {
            console.error(error);
            // pode ser erro de unicidade (email), FK, etc.
            return res
                .status(400)
                .json({ error: "Failed to create adotante. Check your input data." });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing id parameter" });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) {
                return res.status(400).json({ error: "Invalid id parameter" });
            }

            const atualizado = await AdotanteService.update(idNum, req.body);
            return res.status(200).json(atualizado);
        } catch (error) {
            console.error(error);
            return res
                .status(404)
                .json({ error: "Adotante not found or invalid data." });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Missing id parameter" });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) {
                return res.status(400).json({ error: "Invalid id parameter" });
            }

            await AdotanteService.delete(idNum);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Adotante not found." });
        }
    }

    async adotados(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json({ error: 'Missing id parameter' })
            const idNum = parseInt(id, 10)
            if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' })

            const adotante = await AdotanteService.getById(idNum)
            if (!adotante) return res.status(404).json({ error: 'Adotante not found' })

            const adotados: any[] = []
            if (adotante.petBuscado) {
                const pet = await PetService.getById(adotante.petBuscado)
                if (pet && pet.status === ENUM_STATUS.ADOTADO) {
                    adotados.push(pet)
                }
            }

            return res.status(200).json(adotados)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export default new AdotanteController();
