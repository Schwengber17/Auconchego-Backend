import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🧩 Diretório raiz do projeto (onde está a pasta uploads)
const rootDir = path.join(__dirname, "..")

// 📁 pasta de uploads – TEM QUE BATER COM server.ts
// server.ts está usando: path.join(__dirname, "..", "uploads")
// ou seja: ROOT/uploads
const uploadDir = path.join(rootDir, "uploads")

// garante que a pasta exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

console.log("📂 Pasta de uploads:", uploadDir)

// 🧠 configuração do multer para salvar em disco
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now()
        const random = Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname) || ".bin"
        const base = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, "-")
            .toLowerCase()

        const filename = `${base}-${timestamp}-${random}${ext}`
        console.log("💾 Salvando arquivo:", filename)
        cb(null, filename)
    },
})

const upload = multer({ storage })

// monta a URL pública da imagem
function buildFileUrl(filename: string): string {
    const port = process.env.PORT || 3333

    const rawBase =
        process.env.BASE_URL && process.env.BASE_URL.trim() !== ""
            ? process.env.BASE_URL
            : `http://localhost:${port}`

    const cleanBase = rawBase.replace(/\/$/, "")

    // Fica tipo: http://localhost:3333/uploads/arquivo.webp
    const url = `${cleanBase}/uploads/${filename}`
    console.log("🔗 URL gerada para o arquivo:", url)
    return url
}

/**
 * ✅ Rota usada pelo front:
 * POST /api/upload/pet-image
 * body: multipart/form-data com campo "file"
 * retorno: { url: string }
 */
router.post("/pet-image", upload.single("file"), async (req, res) => {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" })
        }

        const url = buildFileUrl(file.filename)

        // Aqui a gente só devolve a URL.
        // O front depois manda essa URL dentro do payload do pet (campo `imagens`).
        return res.status(201).json({ url })
    } catch (err) {
        console.error("Erro no upload de imagem (pet-image):", err)
        return res.status(500).json({ error: "Erro ao processar upload de imagem" })
    }
})

/**
 * 🔁 (Opcional) Rota para anexar diretamente a um pet
 * POST /api/upload/pet/:petId/image
 * body: multipart/form-data com campo "file"
 * retorno: { url, pet }
 */
router.post(
    "/pet/:petId/image",
    upload.single("file"),
    async (req, res): Promise<any> => {
        const { petId } = req.params

        try {
            const file = req.file
            if (!file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado" })
            }

            const id = Number(petId)
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "petId inválido" })
            }

            const url = buildFileUrl(file.filename)

            const petUpdated = await prisma.pet.update({
                where: { id },
                data: {
                    imagens: {
                        push: url,
                    },
                },
            })

            return res.status(201).json({
                url,
                pet: petUpdated,
            })
        } catch (err) {
            console.error("Erro no upload de imagem do pet:", err)
            return res.status(500).json({ error: "Erro ao processar upload de imagem" })
        }
    },
)

export default router
