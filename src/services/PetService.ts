import { PrismaClient } from '@prisma/client';
import type { IPetCreate, IPetUpdate } from '../interfaces/Pet.js';

const prisma = new PrismaClient();

class PetService {

  async getAll() {
        const pets = await prisma.pet.findMany({
            include: {
                ong: {
                    select: {
                        id: true,
                        cnpj: true,
                    }
                }
            }
        });
        return pets;
    }

    async getById(id: number) {
        const pet = await prisma.pet.findUnique({
            where: { id },
             include: {
                ong: true 
            }
        });
        return pet;
    }

    // Registrar novo animal
    async create(petData: IPetCreate) {
        // Ensure required date fields exist to match Prisma schema
        const data = {
            ...petData,
            dataResgate: (petData as any).dataResgate ?? new Date(),
        }

        const newPet = await prisma.pet.create({
            data,
        });
        return newPet;
    }

    async update(id: number, petData: IPetUpdate) {
        const updatedPet = await prisma.pet.update({
            where: { id },
            data: petData,
        });
        return updatedPet;
    }

    async delete(id: number) {
        await prisma.pet.delete({
            where: { id },
        });
    }
}

export default new PetService();
