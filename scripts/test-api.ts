import fetch from "node-fetch"

const BASE_URL = "http://localhost:3333/api"

interface TestResult {
  endpoint: string
  method: string
  status: number
  success: boolean
  message: string
}

const results: TestResult[] = []

async function test(endpoint: string, method = "GET", body?: unknown): Promise<any> {
  try {
    const url = `${BASE_URL}${endpoint}`
    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const statusOk = response.ok || response.status === 400 || response.status === 404

    let message = ""
    let data: any = null
    try {
      data = (await response.json()) as unknown
      message = JSON.stringify(data).substring(0, 100)
    } catch {
      message = response.statusText
    }

    results.push({
      endpoint,
      method,
      status: response.status,
      success: statusOk,
      message,
    })

    console.log(`${statusOk ? "✓" : "✗"} ${method} ${endpoint} - ${response.status}`)
    return data
  } catch (error) {
    results.push({
      endpoint,
      method,
      status: 0,
      success: false,
      message: (error as Error).message,
    })
    console.log(`✗ ${method} ${endpoint} - Error: ${(error as Error).message}`)
    return null
  }
}

async function runTests() {
  console.log("Iniciando testes da API AuConchego...\n")

  // Pets
  console.log("--- Testando Pets ---")
  await test("/pets", "GET")
  await test("/pets/1", "GET")
  await test("/pets", "POST", {
    nome: "Spike",
    especie: "Cachorro",
    raca: "Pit Bull",
    porte: "GRANDE",
    sexo: "MACHO",
    status: "DISPONIVEL",
    necessidadesEspeciais: false,
    idOng: 1,
  })

  // Tutores
  console.log("\n--- Testando Tutores ---")
  await test("/tutores", "GET")
  await test("/tutores/1", "GET")
  const tutorCreated = await test("/tutores", "POST", {
    nome: "João Silva",
    email: "joao@example.com",
    telefone: "11999999999",
    endereco: "Rua A, 123",
    cep: "01310100",
  })
  const tutorId = tutorCreated?.id ?? 1

  // Adotantes
  console.log("\n--- Testando Adotantes ---")
  await test("/adotantes", "GET")
  await test("/adotantes/1", "GET")
  const adotanteCreated = await test("/adotantes", "POST", {
    nome: "Maria Santos",
    email: "maria@example.com",
    telefone: "11988888888",
    endereco: "Avenida B, 456",
    cep: "02145000",
    petsJaPositos: 0,
    especieDesejada: "Gato",
    racaDesejada: "SRD",
    porteDesejado: "PEQUENO",
    sexoDesejado: "FEMEA",
    aceitaNecessidadesEspeciais: true,
  })
  const adotanteId = adotanteCreated?.id ?? 1

  // Histórico de Localização
  console.log("\n--- Testando Histórico de Localização ---")
  await test("/historico-localizacao", "GET")
  await test("/historico-localizacao/1", "GET")
  await test("/historico-localizacao/pet/1", "GET")

  // Visitas de Acompanhamento
  console.log("\n--- Testando Visitas de Acompanhamento ---")
  await test("/visitas-acompanhamento", "GET")
  await test("/visitas-acompanhamento/1", "GET")
  await test("/visitas-acompanhamento/pet/1", "GET")
  await test("/visitas-acompanhamento/tutor/1", "GET")

  // Compatibilidade
  console.log("\n--- Testando Compatibilidade ---")
  await test("/compatibilidade/relatorios", "GET")
  await test("/compatibilidade/alto-compatibilidade", "GET")
  await test("/compatibilidade/adotante/1/pets", "GET")

  // Acompanhamento Pós-Adoção
  console.log("\n--- Testando Acompanhamento ---")
  await test("/acompanhamento/tutor/1", "GET")
  await test("/acompanhamento/alertas", "GET")

  // Health Check
  console.log("\n--- Health Check ---")
  await test("http://localhost:3333/health", "GET")

    // Adoption lifecycle: create request -> approve -> check pet
    console.log("\n--- Testando Fluxo de Adoção ---")
    const petCreatedForFlow = await test("/pets", "POST", {
      nome: "Rex-Test",
      especie: "Cachorro",
      raca: "SRD",
      porte: "MEDIO",
      sexo: "MACHO",
      dataResgate: new Date().toISOString(),
      idOng: 1,
      idTutorOrigem: tutorId,
    })
    const petId = petCreatedForFlow?.id ?? 1

    const adoptionRequest = await test(`/pets/${petId}/adoption-requests`, "POST", {
      idAdotante: adotanteId,
      message: "Tenho espaço e tempo pra cuidar",
    })

    await test(`/adoption-requests?petId=${petId}&status=PENDENTE`, "GET")

    const adoptionId = adoptionRequest?.id ?? 1
    await test(`/adoption-requests/${adoptionId}/approve`, "PUT", {
      responderId: tutorId,
      responderType: "TUTOR",
    })

    const petAfter = await test(`/pets/${petId}`, "GET")
    const petIsAdopted = petAfter?.status === "ADOTADO"
    results.push({
      endpoint: `/pets/${petId} status check`,
      method: "ASSERT",
      status: petIsAdopted ? 200 : 500,
      success: petIsAdopted,
      message: petIsAdopted ? "Pet marcado como ADOTADO" : "Pet não está ADOTADO",
    })
    console.log(`${petIsAdopted ? "✓" : "✗"} Fluxo de adoção - Pet ${petIsAdopted ? "ADOTADO" : "NÃO ADOTADO"}`)

  // Summary
  console.log("\n========== RESUMO DOS TESTES ==========")
  const passed = results.filter((r) => r.success).length
  const total = results.length
  console.log(`Total: ${total} | Passaram: ${passed} | Falharam: ${total - passed}`)
  console.log(`Taxa de sucesso: ${((passed / total) * 100).toFixed(2)}%`)
}

runTests().catch(console.error)
