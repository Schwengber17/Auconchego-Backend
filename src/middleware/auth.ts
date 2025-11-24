import type { Request, Response, NextFunction } from "express"

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "ID parâmetro é obrigatório" })
  }

  const idNum = Number.parseInt(id, 10)
  if (Number.isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "ID deve ser um número válido maior que 0" })
  }
  ;(req as any).idParam = idNum
  next()
}

export const validateBodyNotEmpty = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body não pode estar vazio" })
  }
  next()
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export const rateLimitMiddleware = (maxRequests = 100, windowMs = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown"
    const now = Date.now()

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
      return next()
    }

    const data = requestCounts.get(ip)!
    if (now > data.resetTime) {
      data.count = 1
      data.resetTime = now + windowMs
      return next()
    }

    data.count++
    if (data.count > maxRequests) {
      return res.status(429).json({
        error: "Muitas requisições, tente novamente mais tarde",
      })
    }

    next()
  }
}
