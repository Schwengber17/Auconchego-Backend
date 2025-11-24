export type Porte = "PEQUENO" | "MEDIO" | "GRANDE"
export type Sexo = "MACHO" | "FEMEA"
export type Status = "DISPONIVEL" | "ADOTADO" | "RESERVADO"

export interface ITutor {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  dataCadastro: Date
  idOng: number
}

export interface ITutorCreate {
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  idOng: number
}

export interface ITutorUpdate {
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  idOng?: number
}
