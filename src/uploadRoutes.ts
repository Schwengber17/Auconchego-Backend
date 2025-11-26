import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const router = Router()

// 🧠 ESM: recriando __filename e __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// pasta de uploads na raiz do projeto
const uploadDir = path.join(__dirname, '..', '..', 'uploads')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `${name}-${unique}${ext}`)
    },
})

const upload = multer({ storage })

// POST /api/upload/pet-image
router.post('/pet-image', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Arquivo não enviado' })
    }

    const port = process.env.PORT || 3333
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`
    const url = `${baseUrl}/uploads/${req.file.filename}`

    return res.status(201).json({ url })
})

export default router
