export type TipoLocalizacao = "RESGATE" | "TRANSITO" | "ABRIGO" | "OUTRO"

export interface IHistoricoLocalizacao {
  id: number
  idPet: number
  tipo: TipoLocalizacao
  local: string
  descricao?: string
  dataInicio: Date
  dataFim?: Date
  dataCadastro: Date
}

export interface IHistoricoLocalizacaoCreate {
  idPet: number
  tipo: TipoLocalizacao
  local: string
  descricao?: string
  dataInicio: Date
  dataFim?: Date
}

export interface IHistoricoLocalizacaoUpdate {
  tipo?: TipoLocalizacao
  local?: string
  descricao?: string
  dataInicio?: Date
  dataFim?: Date
}
