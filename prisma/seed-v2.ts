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

  const tutor3 = await prisma.tutor.create({
    data: {
      nome: "Pedro Oliveira",
      email: "pedro@example.com",
      telefone: "(51) 99999-0003",
      endereco: "Avenida Central, 789",
      cidade: "Novo Hamburgo",
      estado: "RS",
      cep: "93500-000",
      idOng: ong1.id,
    },
  })

  // URLs base para as imagens
  const baseUrl = "http://localhost:3333/public/pets"

  // Criar Pets - Cachorros
  console.log("Criando pets disponíveis...")
  
  const cachorros = [
    {
      nome: "Max",
      raca: "Labrador",
      porte: "GRANDE" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_0511_germania_0152_4c59d4e2c8.jpg",
      descricao: "Cão amigável e ativo, adora brincar e se dá bem com crianças",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Excelente saúde, todas as vacinações em dia",
      idade: 3,
      peso: 32.0,
      vacinado: true,
      castrado: true,
      temperamento: ["amigável", "ativo", "brincalhão"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Bella",
      raca: "Golden Retriever",
      porte: "GRANDE" as const,
      sexo: "FEMEA" as const,
      imagem: "cachorros/small_0511_germania_0187_1dd1de5c7c.jpg",
      descricao: "Cadelinha dócil e carinhosa, perfeita para famílias",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 2,
      peso: 28.0,
      vacinado: true,
      castrado: true,
      temperamento: ["dócil", "carinhosa", "calma"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Thor",
      raca: "Pastor Alemão",
      porte: "GRANDE" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_1715548811819923041835691585436_20_20_Francine_20_Kelen_20_281_29_91827a497c.jpg",
      descricao: "Cão inteligente e leal, precisa de espaço para exercícios",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Muito saudável, adora atividades físicas",
      idade: 4,
      peso: 38.0,
      vacinado: true,
      castrado: true,
      temperamento: ["inteligente", "leal", "ativo"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Luna",
      raca: "Border Collie",
      porte: "MEDIO" as const,
      sexo: "FEMEA" as const,
      imagem: "cachorros/small_20240512_181443_20_20_Dayanne_20_Britto_30a0f8ae54.jpg",
      descricao: "Cadelinha muito inteligente e ativa, ideal para quem gosta de atividades",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável e cheia de energia",
      idade: 2,
      peso: 18.0,
      vacinado: true,
      castrado: true,
      temperamento: ["inteligente", "ativa", "energética"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Rex",
      raca: "Rottweiler",
      porte: "GRANDE" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_ararigboia_0005_06ce97d5ca.jpg",
      descricao: "Cão forte e protetor, mas muito carinhoso com a família",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Excelente saúde, todas as vacinações em dia",
      idade: 5,
      peso: 42.0,
      vacinado: true,
      castrado: true,
      temperamento: ["protetor", "carinhoso", "leal"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Mel",
      raca: "Vira-lata",
      porte: "PEQUENO" as const,
      sexo: "FEMEA" as const,
      imagem: "cachorros/small_Captura_de_tela_2024_08_31_071736_ed579ccbae.png",
      descricao: "Cadelinha pequena e carinhosa, ideal para apartamento",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 1,
      peso: 8.0,
      vacinado: true,
      castrado: true,
      temperamento: ["carinhosa", "calma", "dócil"],
      local: "Novo Hamburgo, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor3.id,
    },
    {
      nome: "Zeus",
      raca: "Husky Siberiano",
      porte: "GRANDE" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_Captura_de_tela_2024_08_31_073223_5e4381c6f3.png",
      descricao: "Cão ativo e brincalhão, precisa de muito exercício",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Muito saudável, adora correr e brincar",
      idade: 3,
      peso: 35.0,
      vacinado: true,
      castrado: true,
      temperamento: ["ativo", "brincalhão", "energético"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Bolinha",
      raca: "Bulldog Francês",
      porte: "PEQUENO" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_dog1_f893b2e925.png",
      descricao: "Cãozinho pequeno e adorável, perfeito para companhia",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, todas as vacinações em dia",
      idade: 2,
      peso: 12.0,
      vacinado: true,
      castrado: true,
      temperamento: ["adorável", "calmo", "carinhoso"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Nina",
      raca: "Beagle",
      porte: "MEDIO" as const,
      sexo: "FEMEA" as const,
      imagem: "cachorros/small_Whats_App_20_Image_202024_06_10_20at_2023_42_35_20_281_29_ffc9793c5c.jpeg",
      descricao: "Cadelinha brincalhona e amigável, adora crianças",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 2,
      peso: 15.0,
      vacinado: true,
      castrado: true,
      temperamento: ["brincalhona", "amigável", "sociável"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Toby",
      raca: "Shih Tzu",
      porte: "PEQUENO" as const,
      sexo: "MACHO" as const,
      imagem: "cachorros/small_Whats_App_20_Image_202024_06_10_20at_2023_43_27_4405f9e5bd.jpeg",
      descricao: "Cãozinho pequeno e carinhoso, ideal para apartamento",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, todas as vacinações em dia",
      idade: 1,
      peso: 6.0,
      vacinado: true,
      castrado: true,
      temperamento: ["carinhoso", "calmo", "dócil"],
      local: "Novo Hamburgo, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor3.id,
    },
  ]

  // Criar Pets - Gatos
  const gatos = [
    {
      nome: "Mimi",
      raca: "Siamês",
      porte: "PEQUENO" as const,
      sexo: "FEMEA" as const,
      imagem: "gatos/small_097c134f_e647_49b8_a94c_db03ced140f2_e342f85f31.jpg",
      descricao: "Gata carinhosa e tranquila, ideal para apartamento",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável e bem vacinada",
      idade: 2,
      peso: 4.0,
      vacinado: true,
      castrado: true,
      temperamento: ["carinhosa", "tranquila", "calma"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Felix",
      raca: "Persa",
      porte: "PEQUENO" as const,
      sexo: "MACHO" as const,
      imagem: "gatos/small_17188062109619004497622739409428_f372ebca95.jpg",
      descricao: "Gato calmo e independente, perfeito para quem busca companhia tranquila",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrado e vacinado",
      idade: 3,
      peso: 5.0,
      vacinado: true,
      castrado: true,
      temperamento: ["calmo", "independente", "tranquilo"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Luna",
      raca: "Maine Coon",
      porte: "GRANDE" as const,
      sexo: "FEMEA" as const,
      imagem: "gatos/small_a2020a57_9668_48b8_b893_596a223d5aed_43dbcc83dd.jpeg",
      descricao: "Gata grande e carinhosa, muito dócil com humanos",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Excelente saúde, todas as vacinações em dia",
      idade: 2,
      peso: 7.0,
      vacinado: true,
      castrado: true,
      temperamento: ["carinhosa", "dócil", "calma"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Simba",
      raca: "Vira-lata",
      porte: "MEDIO" as const,
      sexo: "MACHO" as const,
      imagem: "gatos/small_ED_6_B54_E7_2078_4_DA_9_91_CA_2_F3_CD_3_E8_DF_43_3d0795854b.jpg",
      descricao: "Gato brincalhão e curioso, adora explorar",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrado e vacinado",
      idade: 1,
      peso: 4.5,
      vacinado: true,
      castrado: true,
      temperamento: ["brincalhão", "curioso", "ativo"],
      local: "Novo Hamburgo, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor3.id,
    },
    {
      nome: "Nina",
      raca: "Angorá",
      porte: "PEQUENO" as const,
      sexo: "FEMEA" as const,
      imagem: "gatos/small_f5348cba_b4cb_4cdf_9414_1266f3dd57d5_72f75f3908.jpeg",
      descricao: "Gata elegante e carinhosa, adora carinho",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 2,
      peso: 3.5,
      vacinado: true,
      castrado: true,
      temperamento: ["elegante", "carinhosa", "dócil"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Tom",
      raca: "Vira-lata",
      porte: "MEDIO" as const,
      sexo: "MACHO" as const,
      imagem: "gatos/small_Imagem_20do_20_Whats_App_20de_202025_03_06_20_C3_A0_28s_29_2020_39_24_dac5cb92_8d9139eb35.jpg",
      descricao: "Gato independente mas carinhoso, ideal para quem trabalha",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrado e vacinado",
      idade: 3,
      peso: 5.0,
      vacinado: true,
      castrado: true,
      temperamento: ["independente", "carinhoso", "calmo"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
    {
      nome: "Bella",
      raca: "British Shorthair",
      porte: "MEDIO" as const,
      sexo: "FEMEA" as const,
      imagem: "gatos/small_IMG_0106_a306a9764e.jpeg",
      descricao: "Gata tranquila e calma, perfeita para apartamento",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 2,
      peso: 4.5,
      vacinado: true,
      castrado: true,
      temperamento: ["tranquila", "calma", "dócil"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Charlie",
      raca: "Ragdoll",
      porte: "GRANDE" as const,
      sexo: "MACHO" as const,
      imagem: "gatos/small_IMG_1699_2f138612b4.jpeg",
      descricao: "Gato grande e muito dócil, adora colo e carinho",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Excelente saúde, todas as vacinações em dia",
      idade: 3,
      peso: 6.5,
      vacinado: true,
      castrado: true,
      temperamento: ["dócil", "carinhoso", "calmo"],
      local: "Novo Hamburgo, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor3.id,
    },
    {
      nome: "Lola",
      raca: "Siamês",
      porte: "PEQUENO" as const,
      sexo: "FEMEA" as const,
      imagem: "gatos/small_IMG_4831_8d3e009d9f.jpg",
      descricao: "Gata comunicativa e carinhosa, adora atenção",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrada e vacinada",
      idade: 1,
      peso: 3.5,
      vacinado: true,
      castrado: true,
      temperamento: ["comunicativa", "carinhosa", "sociável"],
      local: "Porto Alegre, RS",
      idOng: ong2.id,
      idTutorOrigem: tutor2.id,
    },
    {
      nome: "Oliver",
      raca: "Vira-lata",
      porte: "MEDIO" as const,
      sexo: "MACHO" as const,
      imagem: "gatos/small_large_17188071823456540838608087381615_6842e5deb3.jpg",
      descricao: "Gato brincalhão e sociável, se dá bem com outros animais",
      necessidadesEspeciais: false,
      tratamentoContinuo: false,
      doencaCronica: false,
      descricaoSaude: "Saudável, castrado e vacinado",
      idade: 2,
      peso: 5.0,
      vacinado: true,
      castrado: true,
      temperamento: ["brincalhão", "sociável", "amigável"],
      local: "Porto Alegre, RS",
      idOng: ong1.id,
      idTutorOrigem: tutor1.id,
    },
  ]

  // Criar todos os pets
  const todosPets = [...cachorros, ...gatos]
  const petsCriados = []

  for (const petData of todosPets) {
    const dataResgate = new Date()
    dataResgate.setDate(dataResgate.getDate() - Math.floor(Math.random() * 90) - 30) // Entre 30 e 120 dias atrás
    
    const dataCadastro = new Date(dataResgate)
    dataCadastro.setDate(dataCadastro.getDate() + Math.floor(Math.random() * 10) + 5) // 5 a 15 dias após resgate

    const imagemUrl = `${baseUrl}/${petData.imagem}`
    
    const pet = await prisma.pet.create({
      data: {
        nome: petData.nome,
        especie: petData.imagem.startsWith("cachorros") ? "Cachorro" : "Gato",
        raca: petData.raca,
        porte: petData.porte,
        sexo: petData.sexo,
        status: "DISPONIVEL",
        dataResgate: dataResgate,
        dataCadastro: dataCadastro,
        descricao: petData.descricao,
        necessidadesEspeciais: petData.necessidadesEspeciais,
        tratamentoContinuo: petData.tratamentoContinuo,
        doencaCronica: petData.doencaCronica,
        descricaoSaude: petData.descricaoSaude,
        // Novos campos
        idade: petData.idade ?? null,
        peso: petData.peso ?? null,
        vacinado: petData.vacinado ?? false,
        castrado: petData.castrado ?? false,
        temperamento: petData.temperamento ?? [],
        local: petData.local ?? null,
        idOng: petData.idOng,
        idTutorOrigem: petData.idTutorOrigem,
        imagens: [imagemUrl],
      } as any,
    })
    
    petsCriados.push(pet)
  }

  // Criar Histórico de Localização para alguns pets
  console.log("Criando histórico de localização...")
  await prisma.historicoLocalizacao.create({
    data: {
      idPet: petsCriados[0].id,
      tipo: "RESGATE",
      local: "Parque da Redenção, Porto Alegre",
      descricao: "Encontrado na região do parque",
      dataInicio: petsCriados[0].dataResgate,
      dataFim: petsCriados[0].dataCadastro,
    },
  })

  await prisma.historicoLocalizacao.create({
    data: {
      idPet: petsCriados[0].id,
      tipo: "ABRIGO",
      local: "Abrigo AuConchego",
      descricao: "Atualmente em período de observação",
      dataInicio: petsCriados[0].dataCadastro,
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
      idadeMinima: 1,
      idadeMaxima: 5,
      pesoMinimo: 20.0,
      pesoMaximo: 40.0,
      preferVacinado: true,
      preferCastrado: true,
      preferTemperamento: ["amigável", "ativo", "brincalhão"],
      preferLocalizacao: "São Paulo",
      aceitaNecessidadesEsp: false,
      aceitaTratamentoContinuo: false,
      aceitaDoencaCronica: false,
      temOutrosAnimais: false,
      possuiDisponibilidade: true,
      tipoMoradia: "casa",
      tempoCasa: "medio",
      experiencia: true,
      statusBusca: "PENDENTE",
    } as any,
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
      idadeMinima: 0,
      idadeMaxima: 3,
      pesoMinimo: 2.0,
      pesoMaximo: 6.0,
      preferVacinado: true,
      preferCastrado: true,
      preferTemperamento: ["carinhoso", "tranquilo"],
      preferLocalizacao: "Curitiba",
      aceitaNecessidadesEsp: true,
      aceitaTratamentoContinuo: true,
      aceitaDoencaCronica: false,
      temOutrosAnimais: false,
      possuiDisponibilidade: true,
      tipoMoradia: "apartamento",
      tempoCasa: "alto",
      experiencia: true,
      statusBusca: "PENDENTE",
    } as any,
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
      idadeMinima: 2,
      idadeMaxima: 8,
      pesoMinimo: 10.0,
      pesoMaximo: 25.0,
      preferVacinado: true,
      preferCastrado: false,
      preferTemperamento: ["dócil", "calmo"],
      preferLocalizacao: "Brasília",
      aceitaNecessidadesEsp: true,
      aceitaTratamentoContinuo: true,
      aceitaDoencaCronica: false,
      temOutrosAnimais: true,
      possuiDisponibilidade: true,
      tipoMoradia: "casa",
      tempoCasa: "baixo",
      experiencia: false,
      statusBusca: "PENDENTE",
    } as any,
  })

  console.log("Seed concluído com sucesso!")
  console.log(`- ${2} ONGs criadas`)
  console.log(`- ${3} Tutores criados`)
  console.log(`- ${20} Pets criados`)
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