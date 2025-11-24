export interface IVisitaAcompanhamento {
  id: number
  idPet: number
  idTutor: number
  idOng: number
  dataVisita: Date
  observacoes?: string
  vacinado: boolean
  castrado: boolean
  descricaoSaude?: string
  dataCadastro: Date
}

export interface IVisitaAcompanhamentoCreate {
  idPet: number
  idTutor: number
  idOng: number
  dataVisita: Date
  observacoes?: string
  vacinado?: boolean
  castrado?: boolean
  descricaoSaude?: string
}

export interface IVisitaAcompanhamentoUpdate {
  dataVisita?: Date
  observacoes?: string
  vacinado?: boolean
  castrado?: boolean
  descricaoSaude?: string
}
