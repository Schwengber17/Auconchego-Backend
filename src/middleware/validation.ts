import type { Request, Response, NextFunction } from "express"

export interface ValidationError {
  field: string
  message: string
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateCEP = (cep: string): boolean => {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

export const validateCNPJ = (cnpj: string): boolean => {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
  return cnpjRegex.test(cnpj)
}

export const validateTelefone = (telefone: string): boolean => {
  // Aceita telefone apenas com números (10 ou 11 dígitos)
  // ou com formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const telefoneRegex = /^(\d{10,11}|\(\d{2}\)\s?\d{4,5}-\d{4})$/
  return telefoneRegex.test(telefone)
}

export const validatePetData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!data.nome || data.nome.trim().length === 0) {
    errors.push({ field: "nome", message: "Nome do pet é obrigatório" })
  }

  if (!data.especie || data.especie.trim().length === 0) {
    errors.push({ field: "especie", message: "Espécie é obrigatória" })
  }

  if (!data.raca || data.raca.trim().length === 0) {
    errors.push({ field: "raca", message: "Raça é obrigatória" })
  }

  if (!data.porte || !["PEQUENO", "MEDIO", "GRANDE"].includes(data.porte)) {
    errors.push({ field: "porte", message: "Porte deve ser PEQUENO, MEDIO ou GRANDE" })
  }

  if (!data.sexo || !["MACHO", "FEMEA"].includes(data.sexo)) {
    errors.push({ field: "sexo", message: "Sexo deve ser MACHO ou FEMEA" })
  }

  // idOng é opcional, mas se fornecido, deve ser um número válido
  if (data.idOng !== undefined && data.idOng !== null && isNaN(Number.parseInt(data.idOng))) {
    errors.push({ field: "idOng", message: "ID da ONG deve ser um número válido (opcional)" })
  }

  if (typeof data.necessidadesEspeciais !== "boolean") {
    errors.push({ field: "necessidadesEspeciais", message: "necessidadesEspeciais deve ser booleano" })
  }

  if (typeof data.tratamentoContinuo !== "boolean") {
    errors.push({ field: "tratamentoContinuo", message: "tratamentoContinuo deve ser booleano" })
  }

  if (typeof data.doencaCronica !== "boolean") {
    errors.push({ field: "doencaCronica", message: "doencaCronica deve ser booleano" })
  }

  return errors
}

export const validateTutorData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!data.nome || data.nome.trim().length === 0) {
    errors.push({ field: "nome", message: "Nome é obrigatório" })
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: "email", message: "Email inválido" })
  }

  if (!data.telefone || !validateTelefone(data.telefone)) {
    errors.push({ field: "telefone", message: "Telefone deve estar no formato (XX) XXXXX-XXXX" })
  }

  if (!data.endereco || data.endereco.trim().length === 0) {
    errors.push({ field: "endereco", message: "Endereço é obrigatório" })
  }

  if (!data.cidade || data.cidade.trim().length === 0) {
    errors.push({ field: "cidade", message: "Cidade é obrigatória" })
  }

  if (!data.estado || data.estado.trim().length !== 2) {
    errors.push({ field: "estado", message: "Estado deve ser a sigla (ex: RS)" })
  }

  if (!data.cep || !validateCEP(data.cep)) {
    errors.push({ field: "cep", message: "CEP inválido (formato: XXXXX-XXX ou XXXXXXXX)" })
  }

  // idOng é opcional, mas se fornecido, deve ser um número válido
  if (data.idOng !== undefined && data.idOng !== null && isNaN(Number.parseInt(data.idOng))) {
    errors.push({ field: "idOng", message: "ID da ONG deve ser um número válido (opcional)" })
  }

  return errors
}

export const validateAdotanteData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!data.nome || data.nome.trim().length === 0) {
    errors.push({ field: "nome", message: "Nome é obrigatório" })
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: "email", message: "Email inválido" })
  }

  if (!data.telefone || !validateTelefone(data.telefone)) {
    errors.push({ field: "telefone", message: "Telefone deve estar no formato (XX) XXXXX-XXXX" })
  }

  if (!data.endereco || data.endereco.trim().length === 0) {
    errors.push({ field: "endereco", message: "Endereço é obrigatório" })
  }

  if (!data.cidade || data.cidade.trim().length === 0) {
    errors.push({ field: "cidade", message: "Cidade é obrigatória" })
  }

  if (!data.estado || data.estado.trim().length !== 2) {
    errors.push({ field: "estado", message: "Estado deve ser a sigla (ex: SP)" })
  }

  if (!data.cep || !validateCEP(data.cep)) {
    errors.push({ field: "cep", message: "CEP inválido" })
  }

  if (!data.especieDesejada || data.especieDesejada.trim().length === 0) {
    errors.push({ field: "especieDesejada", message: "Espécie desejada é obrigatória" })
  }

  return errors
}

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    message: err.message,
    stack: err.stack,
  })
  next(err)
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Erro interno do servidor"

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
    method: req.method,
  })
}
