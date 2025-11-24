export const ENUM_PORTE = {
  PEQUENO: "PEQUENO",
  MEDIO: "MEDIO",
  GRANDE: "GRANDE",
} as const

export const ENUM_SEXO = {
  MACHO: "MACHO",
  FEMEA: "FEMEA",
} as const

export const ENUM_STATUS = {
  DISPONIVEL: "DISPONIVEL",
  ADOTADO: "ADOTADO",
  RESERVADO: "RESERVADO",
} as const

export const ENUM_STATUS_ADOCAO = {
  PENDENTE: "PENDENTE",
  APROVADA: "APROVADA",
  REJEITADA: "REJEITADA",
  CONCLUIDA: "CONCLUIDA",
} as const

export const ENUM_TIPO_LOCALIZACAO = {
  RESGATE: "RESGATE",
  TRANSITO: "TRANSITO",
  ABRIGO: "ABRIGO",
  OUTRO: "OUTRO",
} as const

export const ENUM_STATUS_ACOMPANHAMENTO = {
  ACOMPANHANDO: "ACOMPANHANDO",
  CONCLUIDO: "CONCLUIDO",
  PROBLEMATICO: "PROBLEMATICO",
} as const

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CEP: /^\d{5}-?\d{3}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  TELEFONE: /^$$\d{2}$$\s?\d{4,5}-\d{4}$/,
} as const

export const LIMITS = {
  RATE_LIMIT: 1000,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  MAX_REQUEST_SIZE: "10mb",
  ACOMPANHAMENTO_MESES: 6,
  ACOMPANHAMENTO_DIAS: 180,
} as const

export const MESSAGES = {
  SUCCESS: {
    CREATED: "Recurso criado com sucesso",
    UPDATED: "Recurso atualizado com sucesso",
    DELETED: "Recurso deletado com sucesso",
  },
  ERROR: {
    INVALID_EMAIL: "Email inválido",
    INVALID_CEP: "CEP inválido",
    INVALID_CNPJ: "CNPJ inválido",
    INVALID_TELEFONE: "Telefone inválido",
    MISSING_REQUIRED: "Campo obrigatório faltando",
    NOT_FOUND: "Recurso não encontrado",
    CONFLICT: "Conflito de dados",
    INTERNAL_ERROR: "Erro interno do servidor",
  },
} as const
