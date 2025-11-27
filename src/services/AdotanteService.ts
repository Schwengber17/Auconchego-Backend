// src/services/AdotanteService.ts
import { PrismaClient } from "@prisma/client"
import type {
  IAdotanteCreate,
  IAdotanteUpdate,
} from "../interfaces/Adotante.ts"

const prisma = new PrismaClient()

class AdotanteService {
  // Lista todos os adotantes com possíveis relatórios
  async getAll() {
    const adotantes = await prisma.adotante.findMany({
      include: {
        relatorios: true,
      },
    })
    return adotantes
  }

  // Busca um adotante por id (usa `id` lógico do modelo)
  async getById(id: number) {
    const adotante = await prisma.adotante.findUnique({
      where: { id },
      include: { relatorios: true },
    })
    return adotante
  }

  // Cria um adotante simples (não usa modelo Usuario separado)
  async create(data: IAdotanteCreate) {
    // Validação mínima apenas para campos essenciais
    if (!data.nome || !data.email) {
      throw new Error("Nome e email são obrigatórios")
    }

    const novo = await prisma.adotante.create({
      data: {
        nome: data.nome || "",
        email: data.email,
        telefone: data.telefone || "",
        endereco: data.endereco || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
        cep: data.cep || "",
        especieDesejada: data.especieDesejada || "",
        racaDesejada: data.racaDesejada ?? null,
        porteDesejado: data.porteDesejado ?? null,
        sexoDesejado: data.sexoDesejado ?? null,
        // Novos campos de preferência
        idadeMinima: data.idadeMinima ?? null,
        idadeMaxima: data.idadeMaxima ?? null,
        pesoMinimo: data.pesoMinimo ?? null,
        pesoMaximo: data.pesoMaximo ?? null,
        preferVacinado: data.preferVacinado ?? null,
        preferCastrado: data.preferCastrado ?? null,
        preferTemperamento: data.preferTemperamento ?? [],
        preferLocalizacao: data.preferLocalizacao ?? null,
        tipoMoradia: data.tipoMoradia ?? null,
        tempoCasa: data.tempoCasa ?? null,
        experiencia: data.experiencia ?? null,
        // Campos existentes
        aceitaNecessidadesEsp: data.aceitaNecessidadesEsp ?? false,
        aceitaTratamentoContinuo: data.aceitaTratamentoContinuo ?? false,
        aceitaDoencaCronica: data.aceitaDoencaCronica ?? false,
        temOutrosAnimais: data.temOutrosAnimais ?? false,
        possuiDisponibilidade: data.possuiDisponibilidade ?? true,
        statusBusca: data.statusBusca ?? undefined,
      },
    })

    return novo
  }

  // Atualiza adotante (campos diretos no modelo)
  async update(id: number, data: IAdotanteUpdate) {
    // validate existence
    const current = await prisma.adotante.findUnique({ where: { id } })
    if (!current) throw new Error('Adotante não encontrado')

    const updated = await prisma.adotante.update({
      where: { id },
      data: {
        ...(data.nome !== undefined && { nome: data.nome }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.telefone !== undefined && { telefone: data.telefone }),
        ...(data.endereco !== undefined && { endereco: data.endereco }),
        ...(data.cidade !== undefined && { cidade: data.cidade }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.cep !== undefined && { cep: data.cep }),
        ...(data.especieDesejada !== undefined && { especieDesejada: data.especieDesejada }),
        ...(data.racaDesejada !== undefined && { racaDesejada: data.racaDesejada }),
        ...(data.porteDesejado !== undefined && { porteDesejado: data.porteDesejado }),
        ...(data.sexoDesejado !== undefined && { sexoDesejado: data.sexoDesejado }),
        // Novos campos de preferência
        ...(data.idadeMinima !== undefined && { idadeMinima: data.idadeMinima }),
        ...(data.idadeMaxima !== undefined && { idadeMaxima: data.idadeMaxima }),
        ...(data.pesoMinimo !== undefined && { pesoMinimo: data.pesoMinimo }),
        ...(data.pesoMaximo !== undefined && { pesoMaximo: data.pesoMaximo }),
        ...(data.preferVacinado !== undefined && { preferVacinado: data.preferVacinado }),
        ...(data.preferCastrado !== undefined && { preferCastrado: data.preferCastrado }),
        ...(data.preferTemperamento !== undefined && { preferTemperamento: data.preferTemperamento }),
        ...(data.preferLocalizacao !== undefined && { preferLocalizacao: data.preferLocalizacao }),
        ...(data.tipoMoradia !== undefined && { tipoMoradia: data.tipoMoradia }),
        ...(data.tempoCasa !== undefined && { tempoCasa: data.tempoCasa }),
        ...(data.experiencia !== undefined && { experiencia: data.experiencia }),
        // Campos existentes
        ...(data.aceitaNecessidadesEsp !== undefined && { aceitaNecessidadesEsp: data.aceitaNecessidadesEsp }),
        ...(data.aceitaTratamentoContinuo !== undefined && { aceitaTratamentoContinuo: data.aceitaTratamentoContinuo }),
        ...(data.aceitaDoencaCronica !== undefined && { aceitaDoencaCronica: data.aceitaDoencaCronica }),
        ...(data.temOutrosAnimais !== undefined && { temOutrosAnimais: data.temOutrosAnimais }),
        ...(data.possuiDisponibilidade !== undefined && { possuiDisponibilidade: data.possuiDisponibilidade }),
        ...(data.statusBusca !== undefined && { statusBusca: data.statusBusca }),
      },
    })

    return updated
  }

  async delete(id: number) {
    await prisma.adotante.delete({ where: { id } })
  }
}

export default new AdotanteService()
