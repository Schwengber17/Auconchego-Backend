import { Router } from "express"
import PetController from "./controllers/PetController.js"
import TutorController from "./controllers/TutorController.js"
import AdotanteController from "./controllers/AdotanteController.js"
import HistoricoLocalizacaoController from "./controllers/HistoricoLocalizacaoController.js"
import VisitaAcompanhamentoController from "./controllers/VisitaAcompanhamentoController.js"
import CompatibilidadeController from "./controllers/CompatibilidadeController.js"
import RelatorioAcompanhamentoController from "./controllers/RelatorioAcompanhamentoController.js"
import OngController from "./controllers/OngController.js"

const router = Router()

router.get("/pets", PetController.list)
router.get("/pets/:id", PetController.show)
router.post("/pets", PetController.create)
router.put("/pets/:id", PetController.update)
router.delete("/pets/:id", PetController.delete)

router.get("/tutores", TutorController.list)
router.get("/tutores/:id", TutorController.show)
router.post("/tutores", TutorController.create)
router.put("/tutores/:id", TutorController.update)
router.delete("/tutores/:id", TutorController.delete)

router.get("/adotantes", AdotanteController.list)
router.get("/adotantes/:id", AdotanteController.show)
router.get('/adotantes/:id/adotados', AdotanteController.adotados)
router.post("/adotantes", AdotanteController.create)
router.put("/adotantes/:id", AdotanteController.update)
router.delete("/adotantes/:id", AdotanteController.delete)

router.get("/historico-localizacao", HistoricoLocalizacaoController.list)
router.get("/historico-localizacao/:id", HistoricoLocalizacaoController.show)
router.get("/historico-localizacao/pet/:petId", HistoricoLocalizacaoController.getByPet)
router.post("/historico-localizacao", HistoricoLocalizacaoController.create)
router.put("/historico-localizacao/:id", HistoricoLocalizacaoController.update)
router.delete("/historico-localizacao/:id", HistoricoLocalizacaoController.delete)

router.get("/visitas-acompanhamento", VisitaAcompanhamentoController.list)
router.get("/visitas-acompanhamento/:id", VisitaAcompanhamentoController.show)
router.get("/visitas-acompanhamento/pet/:petId", VisitaAcompanhamentoController.getByPet)
router.get("/visitas-acompanhamento/tutor/:tutorId", VisitaAcompanhamentoController.getByTutor)
router.post("/visitas-acompanhamento", VisitaAcompanhamentoController.create)
router.put("/visitas-acompanhamento/:id", VisitaAcompanhamentoController.update)
router.delete("/visitas-acompanhamento/:id", VisitaAcompanhamentoController.delete)

router.post("/compatibilidade/calcular", CompatibilidadeController.calcular)
router.get("/compatibilidade/adotante/:idAdotante/pets", CompatibilidadeController.buscarPetsCompativeis)
router.get("/compatibilidade/pet/:idPet/adotantes", CompatibilidadeController.buscarAdotantesCompativeis)
router.get("/compatibilidade/relatorios", CompatibilidadeController.listarRelatorios)
router.get("/compatibilidade/alto-compatibilidade", CompatibilidadeController.obterAltoCompatibilidade)

router.post("/acompanhamento/relatorio", RelatorioAcompanhamentoController.gerarRelatorio)
router.get("/acompanhamento/tutor/:tutorId", RelatorioAcompanhamentoController.listarPorTutor)
router.get("/acompanhamento/alertas", RelatorioAcompanhamentoController.obterAlertas)

// ONG routes
router.get('/ongs', OngController.list)
router.get('/ongs/:id', OngController.show)
router.post('/ongs', OngController.create)
router.put('/ongs/:id', OngController.update)
router.delete('/ongs/:id', OngController.delete)

// Adoption flow
router.post('/pets/:id/adopt', PetController.adopt)

export default router
