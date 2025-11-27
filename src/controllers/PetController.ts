import type { Request, Response } from 'express';
import PetService from '../services/PetService.js';
import AdotanteService from '../services/AdotanteService.js';
import { ENUM_STATUS_ADOCAO, ENUM_STATUS } from '../utils/constants.js'

class PetController {
    async list(req: Request, res: Response) {
        try {
            const statusParam = req.query.status as string | undefined
            // Se status for string vazia ou undefined, passar undefined para retornar todos os pets
            const filter = (statusParam && statusParam !== '') ? { status: statusParam } : undefined
            const pets = await PetService.getAll(filter);
            return res.status(200).json(pets);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Missing id parameter' });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' });

            const pet = await PetService.getById(idNum);
            if (!pet) return res.status(404).json({ error: 'Pet not found' });
            return res.status(200).json(pet);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const newPet = await PetService.create(req.body);
            return res.status(201).json(newPet);
        } catch (error) {
            console.error('❌ Erro ao criar pet:', error);
            // Distinguish missing ONG (foreign key) to give clearer message
            if ((error as any).message === 'ONG_NOT_FOUND') {
                return res.status(400).json({ 
                    error: 'ONG not found. Please provide a valid idOng or leave it empty if the tutor has no ONG associated.' 
                });
            }
            // Pode ser outro erro de FK ou validação
            return res.status(400).json({ 
                error: 'Failed to create pet. Check your input data.',
                details: (error as any).message 
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Missing id parameter' });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' });

            const updatedPet = await PetService.update(idNum, req.body);
            return res.status(200).json(updatedPet);
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: 'Pet not found or invalid data.' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Missing id parameter' });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' });

            await PetService.delete(idNum);
            // Retorna 204 No Content, que é o padrão para delete bem-sucedido.
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: 'Pet not found.' });
        }
    }

    async adopt(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Missing id parameter' });
            const idNum = parseInt(id, 10);
            if (Number.isNaN(idNum)) return res.status(400).json({ error: 'Invalid id parameter' });

            const { idAdotante } = req.body as { idAdotante?: number }

            // ensure adotante exists if provided
            if (typeof idAdotante !== 'undefined') {
                const adot = await AdotanteService.getById(Number(idAdotante))
                if (!adot) return res.status(400).json({ error: 'Adotante not found' })
            }

            const adopted = await PetService.adopt(idNum, idAdotante ? Number(idAdotante) : undefined)
            return res.status(200).json(adopted)
        } catch (error) {
            console.error(error)
            return res.status(400).json({ error: 'Failed to adopt pet' })
        }
    }
}

export default new PetController();
