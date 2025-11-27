import "dotenv/config"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import path from "path"
import uploadRoutes from "./uploadRoutes"
import { fileURLToPath } from "url"
import router from "./routes.js"
import { errorLogger, errorHandler, notFoundHandler } from "./middleware/validation.js"
import { rateLimitMiddleware } from "./middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3333

// ✅ Configuração base de CORS
const corsOptions: cors.CorsOptions = {
    origin: true,        // reflete o Origin (ex: http://localhost:5173)
    credentials: true,   // permite cookies/credenciais
}

// Middleware global do cors
app.use(cors(corsOptions))

// ✅ Middleware manual para tratar TODOS os OPTIONS (preflight)
// Sem usar "*", então não quebra o path-to-regexp do Express 5
app.use((req: Request, res: Response, next: NextFunction) => {
    // garante que os headers estejam sempre presentes
    const origin = req.headers.origin || "*"
    res.header("Access-Control-Allow-Origin", origin as string)
    res.header("Vary", "Origin")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    )

    if (req.method === "OPTIONS") {
        // preflight: não passa pros handlers, só responde 204
        return res.sendStatus(204)
    }

    next()
})

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Servir arquivos estáticos da pasta public
app.use("/public", express.static(path.join(__dirname, "../public")))

// Rate limit global
app.use(rateLimitMiddleware(1000, 60000)) // 1000 requests per minute

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// ✅ arquivos estáticos de imagem
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

// ✅ rotas de upload
app.use("/api/upload", uploadRoutes)

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
            ongs: "/api/ongs",
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
