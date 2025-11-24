export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const asyncHandler = (fn: Function) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2])
}

export const handlePrismaError = (error: any) => {
  if (error.code === "P2025") {
    // Not found
    return new AppError("Registro não encontrado", 404)
  }

  if (error.code === "P2002") {
    // Unique constraint
    const field = error.meta?.target?.[0] || "field"
    return new AppError(`${field} já existe no banco de dados`, 409)
  }

  if (error.code === "P2003") {
    // Foreign key constraint
    return new AppError("Referência inválida para registro relacionado", 400)
  }

  if (error.code === "P2014") {
    // Required relation violation
    return new AppError("Não é possível deletar esse registro por dependências", 400)
  }

  return error
}
