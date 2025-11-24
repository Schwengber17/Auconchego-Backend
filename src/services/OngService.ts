import { PrismaClient } from '@prisma/client'
import type { Request } from 'express'

const prisma = new PrismaClient()

class OngService {
  async getAll() {
    const rows: any = await prisma.$queryRaw`SELECT id_ong as id, cnpj, endereco, nome, telefone, email FROM ong`
    return rows
  }

  async getById(id: number) {
    const rows: any = await prisma.$queryRaw`SELECT id_ong as id, cnpj, endereco, nome, telefone, email FROM ong WHERE id_ong = ${id}`
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
  }

  async create(data: { cnpj: string; endereco?: string; nome: string; telefone?: string; email?: string }) {
    // basic validation
    if (!data.nome || !data.cnpj) {
      throw new Error('Missing required fields: nome or cnpj')
    }
    const row: any = await prisma.$queryRaw`
      INSERT INTO ong (cnpj, endereco, nome, telefone, email)
      VALUES (${data.cnpj}, ${data.endereco ?? null}, ${data.nome}, ${data.telefone ?? null}, ${data.email ?? null})
      RETURNING id_ong as id, cnpj, endereco, nome, telefone, email
    `
    return Array.isArray(row) && row.length > 0 ? row[0] : row
  }

  async update(id: number, data: any) {
    // Build a simple update using COALESCE to keep existing values when null provided
    const row: any = await prisma.$queryRaw`
      UPDATE ong SET
        cnpj = COALESCE(${data.cnpj}, cnpj),
        endereco = COALESCE(${data.endereco}, endereco),
        nome = COALESCE(${data.nome}, nome),
        telefone = COALESCE(${data.telefone}, telefone),
        email = COALESCE(${data.email}, email)
      WHERE id_ong = ${id}
      RETURNING id_ong as id, cnpj, endereco, nome, telefone, email
    `
    return Array.isArray(row) && row.length > 0 ? row[0] : null
  }

  async delete(id: number) {
    await prisma.$queryRaw`DELETE FROM ong WHERE id_ong = ${id}`
  }
}

export default new OngService()
