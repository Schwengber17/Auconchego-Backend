import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando seed do banco de dados...")

  // Limpar dados existentes
  console.log("Limpando dados existentes...")
  await prisma.relatorioCompatibilidade.deleteMany()
  await prisma.visitaAcompanhamento.deleteMany()
  await prisma.historicoLocalizacao.deleteMany()
  await prisma.adotante.deleteMany()
  await prisma.tutor.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.oNG.deleteMany()

  // Criar ONGs
  console.log("Criando ONGs...")
  const ong1 = await prisma.oNG.create({
    data: {
      cnpj: "12.345.678/0001-90",
      nome: "AuConchego - Abrigo de Animais",
      endereco: "Rua da Esperança, 100 - Rio Grande do Sul",
      telefone: "(51) 3333-3333",
      email: "contato@auconchego.org.br",
    },
  })

  const ong2 = await prisma.oNG.create({
    data: {
      cnpj: "98.765.432/0001-10",
      nome: "Protetor de Animais RS",
      endereco: "Avenida Principal, 500 - Porto Alegre",
      telefone: "(51) 4444-4444",
      email: "contato@protetor.org.br",
    },
  })

  // Criar Tutores Originais (de resgate)
  console.log("Criando tutores originais...")
  const tutor1 = await prisma.tutor.create({
    data: {
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "(51) 99999-0001",
      endereco: "Rua das Flores, 123",
      cidade: "Porto Alegre",
      estado: "RS",
      cep: "90000-000",
      idOng: ong1.id,
    },
  })

  const tutor2 = await prisma.tutor.create({
    data: {
      nome: "Maria Santos",
      email: "maria@example.com",
      telefone: "(51) 99999-0002",
      endereco: "Rua da Paz, 456",
      cidade: "Canoas",
      estado: "RS",
      cep: "92000-000",
      idOng: ong2.id,
    },
  })

  // Criar Pets
  console.log("Criando pets disponíveis...")
  const pet1 = await prisma.pet.create({
    data: {
      nome: "Max",
      especie: "Cachorro",
      raca: "Labrador",
      porte: "GRANDE",
      sexo: "MACHO",
      status: "DISPONIVEL",
      dataResgate: new Date("2025-11-01"),
      dataCadastro: new Date("2025-11-05"),
      descricao: "Cão amigável e ativo, adora brincar",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Excelente saúde, todas as vacinações em dia",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
  })

  const pet2 = await prisma.pet.create({
    data: {
      nome: "Luna",
      especie: "Gato",
      raca: "Siamês",
      porte: "PEQUENO",
      sexo: "FEMEA",
      status: "DISPONIVEL",
      dataResgate: new Date("2025-10-15"),
      dataCadastro: new Date("2025-10-20"),
      descricao: "Gata carinhosa e tranquila, ideal para apartamento",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável e bem vacinada",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
  })

  const pet3 = await prisma.pet.create({
    data: {
      nome: "Chico",
      especie: "Cachorro",
      raca: "Vira-lata",
      porte: "MEDIO",
      sexo: "MACHO",
      status: "DISPONIVEL",
      dataResgate: new Date("2025-09-01"),
      dataCadastro: new Date("2025-09-10"),
      descricao: "Cão dócil com necessidades especiais",
      necessidadesEspeciais: true,
      tratamentoContinuo: true,
      doencaCronica: false,
      descricaoSaude: "Requer medicação diária para controle de dermatite",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
  })

  // Criar Histórico de Localização
  console.log("Criando histórico de localização...")
  await prisma.historicoLocalizacao.create({
    data: {
      idPet: pet1.id,
      tipo: "RESGATE",
      local: "Parque da Redenção, Porto Alegre",
      descricao: "Encontrado na região do parque",
      dataInicio: new Date("2025-11-01"),
      dataFim: new Date("2025-11-05"),
    },
  })

  await prisma.historicoLocalizacao.create({
    data: {
      idPet: pet1.id,
      tipo: "ABRIGO",
      local: "Abrigo AuConchego",
      descricao: "Atualmente em período de observação",
      dataInicio: new Date("2025-11-05"),
    },
  })

  // Criar Adotantes
  console.log("Criando adotantes em potencial...")
  const adotante1 = await prisma.adotante.create({
    data: {
      nome: "Carlos Oliveira",
      email: "carlos@example.com",
      telefone: "(51) 98888-0001",
      endereco: "Avenida Paulista, 1000",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01311-100",
      especieDesejada: "Cachorro",
      racaDesejada: "Labrador",
      porteDesejado: "GRANDE",
      sexoDesejado: "MACHO",
      aceitaNecessidadesEsp: false,
      aceitaTratamentoContinuo: false,
      aceitaDoencaCronica: false,
      temOutrosAnimais: false,
      possuiDisponibilidade: true,
      statusBusca: "PENDENTE",
    },
  })

  const adotante2 = await prisma.adotante.create({
    data: {
      nome: "Ana Costa",
      email: "ana@example.com",
      telefone: "(51) 98888-0002",
      endereco: "Rua das Acácias, 789",
      cidade: "Curitiba",
      estado: "PR",
      cep: "80000-000",
      especieDesejada: "Gato",
      racaDesejada: "Siamês",
      porteDesejado: "PEQUENO",
      sexoDesejado: "FEMEA",
      aceitaNecessidadesEsp: true,
      aceitaTratamentoContinuo: true,
      aceitaDoencaCronica: false,
      temOutrosAnimais: false,
      possuiDisponibilidade: true,
      statusBusca: "PENDENTE",
    },
  })

  const adotante3 = await prisma.adotante.create({
    data: {
      nome: "Beatriz Ferreira",
      email: "beatriz@example.com",
      telefone: "(51) 98888-0003",
      endereco: "Rua do Comércio, 456",
      cidade: "Brasília",
      estado: "DF",
      cep: "70000-000",
      especieDesejada: "Cachorro",
      porteDesejado: "MEDIO",
      aceitaNecessidadesEsp: true,
      aceitaTratamentoContinuo: true,
      aceitaDoencaCronica: false,
      temOutrosAnimais: false,
      possuiDisponibilidade: true,
      statusBusca: "PENDENTE",
    },
  })

  console.log("Seed concluído com sucesso!")
  console.log(`- ${2} ONGs criadas`)
  console.log(`- ${2} Tutores criados`)
  console.log(`- ${3} Pets criados`)
  console.log(`- ${3} Adotantes criados`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
