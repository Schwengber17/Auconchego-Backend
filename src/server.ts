import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "path"
import uploadRoutes from './uploadRoutes'
import { fileURLToPath } from "url"
import router from "./routes.js"
import { errorLogger, errorHandler, notFoundHandler } from "./middleware/validation.js"
import { rateLimitMiddleware } from "./middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3333

app.use(
  cors({
    // Allow any origin. Using `origin: true` causes the server to reflect
    // the request's Origin header which works together with `credentials: true`.
    origin: true,
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Servir arquivos estáticos da pasta public
app.use("/public", express.static(path.join(__dirname, "../public")))

app.use(rateLimitMiddleware(1000, 60000)) // 1000 requests per minute

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use('/api/upload', uploadRoutes)

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bem-vindo ao AuConchego API",
    version: "1.0.0",
    description: "Sistema de cadastramento de pets disponíveis para adoção",
    status: "Online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      documentation: "/api/docs",
      pets: "/api/pets",
      tutores: "/api/tutores",
      adotantes: "/api/adotantes",
      historico: "/api/historico-localizacao",
      visitas: "/api/visitas-acompanhamento",
      compatibilidade: "/api/compatibilidade",
      acompanhamento: "/api/acompanhamento",
    },
    database: {
      connected: true,
      type: "PostgreSQL",
    },
    environment: process.env.NODE_ENV || "development",
  })
})

app.use("/api", router)

app.use(errorLogger)
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`)
})
