export interface IRelatorioCompatibilidade {
  id: number
  idAdotante: number
  idPet: number
  pontuacaoTotal: number
  compatibilidade: number
  pontoEspecie: number
  pontoRaca: number
  pontoPorte: number
  pontoSexo: number
  pontoSaude: number
  pontoSocial: number
  pontoIdade: number
  pontoPeso: number
  pontoVacinacao: number
  pontoCastracao: number
  pontoTemperamento: number
  pontoLocalizacao: number
  pontoAmbiente: number
  fatorImpeditivo: boolean
  descricaoImpeditivo?: string
  dataCriacaoRelatorio: Date
}

export interface IRelatorioCompatibilidadeCreate {
  idAdotante: number
  idPet: number
  pontuacaoTotal: number
  compatibilidade: number
  pontoEspecie?: number
  pontoRaca?: number
  pontoPorte?: number
  pontoSexo?: number
  pontoSaude?: number
  pontoSocial?: number
  pontoIdade?: number
  pontoPeso?: number
  pontoVacinacao?: number
  pontoCastracao?: number
  pontoTemperamento?: number
  pontoLocalizacao?: number
  pontoAmbiente?: number
  fatorImpeditivo?: boolean
  descricaoImpeditivo?: string
}
