// src/controllers/TutorController.ts
import type { Request, Response } from "express";
import TutorService from "../services/TutorService.js";

class TutorController {
    async list(req: Request, res: Response) {
        try {
            const tutores = await TutorService.getAll();
            return res.status(200).json(tutores);
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

            const tutor = await TutorService.getById(idNum);
            if (!tutor) return res.status(404).json({ error: "Tutor not found" });
            return res.status(200).json(tutor);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const novo = await TutorService.create(req.body);
            return res.status(201).json(novo);
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ error: "Failed to create tutor. Check your input data." });
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

            const atualizado = await TutorService.update(idNum, req.body);
            return res.status(200).json(atualizado);
        } catch (error) {
            console.error(error);
            return res
                .status(404)
                .json({ error: "Tutor not found or invalid data." });
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

            await TutorService.delete(idNum);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Tutor not found." });
        }
    }
}

export default new TutorController();
