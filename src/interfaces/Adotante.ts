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
  aceitaNecessidadesEsp: boolean
  aceitaTratamentoContinuo: boolean
  aceitaDoencaCronica: boolean
  temOutrosAnimais: boolean
  possuiDisponibilidade: boolean
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
  aceitaNecessidadesEsp?: boolean
  aceitaTratamentoContinuo?: boolean
  aceitaDoencaCronica?: boolean
  temOutrosAnimais?: boolean
  possuiDisponibilidade?: boolean
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
  aceitaNecessidadesEsp?: boolean
  aceitaTratamentoContinuo?: boolean
  aceitaDoencaCronica?: boolean
  temOutrosAnimais?: boolean
  possuiDisponibilidade?: boolean
  petBuscado?: number
  statusBusca?: string
}
