export interface IAdotante {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  especieDesejada: string
  racaDesejada?: string
  porteDesejado?: string
  sexoDesejado?: string
  
  // Preferências de idade e peso
  idadeMinima?: number
  idadeMaxima?: number
  pesoMinimo?: number
  pesoMaximo?: number
  
  // Preferências de saúde e cuidados
  aceitaNecessidadesEsp: boolean
  aceitaTratamentoContinuo: boolean
  aceitaDoencaCronica: boolean
  preferVacinado?: boolean
  preferCastrado?: boolean
  
  // Preferências de temperamento
  preferTemperamento?: string[]
  
  // Preferências de localização
  preferLocalizacao?: string
  
  // Ambiente e estilo de vida
  temOutrosAnimais: boolean
  possuiDisponibilidade: boolean
  tipoMoradia?: string
  tempoCasa?: string
  experiencia?: boolean
  
  petBuscado?: number
  statusBusca: string
  dataCadastro: Date
}

export interface IAdotanteCreate {
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  especieDesejada: string
  racaDesejada?: string
  porteDesejado?: string
  sexoDesejado?: string
  
  // Preferências de idade e peso
  idadeMinima?: number
  idadeMaxima?: number
  pesoMinimo?: number
  pesoMaximo?: number
  
  // Preferências de saúde e cuidados
  aceitaNecessidadesEsp?: boolean
  aceitaTratamentoContinuo?: boolean
  aceitaDoencaCronica?: boolean
  preferVacinado?: boolean
  preferCastrado?: boolean
  
  // Preferências de temperamento
  preferTemperamento?: string[]
  
  // Preferências de localização
  preferLocalizacao?: string
  
  // Ambiente e estilo de vida
  temOutrosAnimais?: boolean
  possuiDisponibilidade?: boolean
  tipoMoradia?: string
  tempoCasa?: string
  experiencia?: boolean
}

export interface IAdotanteUpdate {
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  especieDesejada?: string
  racaDesejada?: string
  porteDesejado?: string
  sexoDesejado?: string
  
  // Preferências de idade e peso
  idadeMinima?: number
  idadeMaxima?: number
  pesoMinimo?: number
  pesoMaximo?: number
  
  // Preferências de saúde e cuidados
  aceitaNecessidadesEsp?: boolean
  aceitaTratamentoContinuo?: boolean
  aceitaDoencaCronica?: boolean
  preferVacinado?: boolean
  preferCastrado?: boolean
  
  // Preferências de temperamento
  preferTemperamento?: string[]
  
  // Preferências de localização
  preferLocalizacao?: string
  
  // Ambiente e estilo de vida
  temOutrosAnimais?: boolean
  possuiDisponibilidade?: boolean
  tipoMoradia?: string
  tempoCasa?: string
  experiencia?: boolean
  
  petBuscado?: number
  statusBusca?: string
}
