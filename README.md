# AuConchego - Sistema de Adoção de Pets

Sistema backend completo para cadastro, rastreabilidade e acompanhamento de pets disponíveis para adoção, com sistema de compatibilidade inteligente entre adotantes e pets.

## Visão Geral

AuConchego é uma plataforma desenvolvida como projeto acadêmico para gerenciar:
- Cadastro de pets disponíveis para adoção
- Histórico de rastreabilidade de localização de pets (desde o resgate)
- Cadastro de tutores (origem dos pets)
- Cadastro de adotantes com preferências
- Sistema de compatibilidade automática entre pet e adotante
- Acompanhamento pós-adoção por até 6 meses
- Geração de relatórios de compatibilidade

## Stack Tecnológico

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validação**: Custom middleware

## Requisitos do Sistema

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## Instalação

### 1. Clone o repositório

\`\`\`bash
git clone <repository-url>
cd auconchego-backend
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/auconchego"
PORT=3333
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
\`\`\`

### 4. Execute as migrations

\`\`\`bash
npx prisma migrate deploy
\`\`\`

### 5. Execute o seed (opcional)

\`\`\`bash
npx prisma db seed
\`\`\`

### 6. Inicie o servidor

\`\`\`bash
npm run dev
\`\`\`

O servidor estará disponível em `http://localhost:3333`

## Estrutura de Diretórios

\`\`\`
src/
├── controllers/          # Controllers dos endpoints
├── services/            # Lógica de negócio
├── interfaces/          # Interfaces TypeScript
├── middleware/          # Middlewares (validação, auth, etc)
├── utils/               # Utilitários
├── routes.ts            # Configuração de rotas
└── server.ts            # Inicialização do servidor

prisma/
├── schema.prisma        # Schema do banco
└── migrations/          # Migrações do banco
\`\`\`

## Documentação da API

### Base URL
\`\`\`
http://localhost:3333/api
\`\`\`

### Autenticação
Atualmente, a API não requer autenticação. Implementação de JWT pode ser adicionada futuramente.

---

## Endpoints

### PETS

#### Listar todos os pets
\`\`\`http
GET /api/pets
\`\`\`

Retorna lista de todos os pets cadastrados.

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "nome": "Max",
    "especie": "Cachorro",
    "raca": "Labrador",
    "porte": "GRANDE",
    "sexo": "MACHO",
    "status": "DISPONIVEL",
    "necessidadesEspeciais": false,
    "tratamentoContinuo": false,
    "doencaCronica": false,
    "ong": { "id": 1, "cnpj": "12.345.678/0001-90" }
  }
]
\`\`\`

#### Obter pet por ID
\`\`\`http
GET /api/pets/:id
\`\`\`

**Response:** Objeto pet com dados completos incluindo ONG.

#### Criar novo pet
\`\`\`http
POST /api/pets
Content-Type: application/json

{
  "nome": "Rex",
  "especie": "Cachorro",
  "raca": "Pastor Alemão",
  "porte": "GRANDE",
  "sexo": "MACHO",
  "dataResgate": "2025-11-23T00:00:00Z",
  "descricao": "Cão energético e amigável",
  "necessidadesEspeciais": false,
  "tratamentoContinuo": false,
  "doencaCronica": false,
  "descricaoSaude": "Saudável",
  "idOng": 1
}
\`\`\`

#### Atualizar pet
\`\`\`http
PUT /api/pets/:id
Content-Type: application/json

{
  "status": "ADOTADO",
  "idTutorAdotante": 1
}
\`\`\`

#### Deletar pet
\`\`\`http
DELETE /api/pets/:id
\`\`\`

---

### TUTORES

#### Listar tutores
\`\`\`http
GET /api/tutores
\`\`\`

#### Obter tutor por ID
\`\`\`http
GET /api/tutores/:id
\`\`\`

#### Criar tutor
\`\`\`http
POST /api/tutores
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(51) 99999-0001",
  "endereco": "Rua das Flores, 123",
  "cidade": "Porto Alegre",
  "estado": "RS",
  "cep": "90000-000",
  "idOng": 1
}
\`\`\`

#### Atualizar tutor
\`\`\`http
PUT /api/tutores/:id
Content-Type: application/json

{
  "telefone": "(51) 99999-0002",
  "endereco": "Rua Nova, 456"
}
\`\`\`

#### Deletar tutor
\`\`\`http
DELETE /api/tutores/:id
\`\`\`

---

### ADOTANTES

#### Listar adotantes
\`\`\`http
GET /api/adotantes
\`\`\`

#### Obter adotante por ID
\`\`\`http
GET /api/adotantes/:id
\`\`\`

#### Criar adotante
\`\`\`http
POST /api/adotantes
Content-Type: application/json

{
  "nome": "Ana Costa",
  "email": "ana@example.com",
  "telefone": "(51) 98888-0001",
  "endereco": "Rua Principal, 789",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01000-000",
  "especieDesejada": "Cachorro",
  "racaDesejada": "Labrador",
  "porteDesejado": "GRANDE",
  "sexoDesejado": "MACHO",
  "aceitaNecessidadesEsp": false,
  "aceitaTratamentoContinuo": false,
  "aceitaDoencaCronica": false,
  "temOutrosAnimais": false,
  "possuiDisponibilidade": true
}
\`\`\`

#### Atualizar adotante
\`\`\`http
PUT /api/adotantes/:id
\`\`\`

#### Deletar adotante
\`\`\`http
DELETE /api/adotantes/:id
\`\`\`

---

### HISTÓRICO DE LOCALIZAÇÃO

#### Listar histórico
\`\`\`http
GET /api/historico-localizacao
\`\`\`

#### Obter histórico por ID
\`\`\`http
GET /api/historico-localizacao/:id
\`\`\`

#### Obter histórico de um pet
\`\`\`http
GET /api/historico-localizacao/pet/:petId
\`\`\`

#### Registrar nova localização
\`\`\`http
POST /api/historico-localizacao
Content-Type: application/json

{
  "idPet": 1,
  "tipo": "RESGATE",
  "local": "Parque da Redenção",
  "descricao": "Encontrado na região do parque",
  "dataInicio": "2025-11-01T10:00:00Z",
  "dataFim": "2025-11-05T14:00:00Z"
}
\`\`\`

**Tipos de localização**: `RESGATE`, `TRANSITO`, `ABRIGO`, `OUTRO`

#### Atualizar histórico
\`\`\`http
PUT /api/historico-localizacao/:id
\`\`\`

#### Deletar histórico
\`\`\`http
DELETE /api/historico-localizacao/:id
\`\`\`

---

### VISITAS DE ACOMPANHAMENTO (Pós-Adoção)

#### Listar visitas
\`\`\`http
GET /api/visitas-acompanhamento
\`\`\`

#### Obter visita por ID
\`\`\`http
GET /api/visitas-acompanhamento/:id
\`\`\`

#### Visitas de um pet
\`\`\`http
GET /api/visitas-acompanhamento/pet/:petId
\`\`\`

#### Visitas de um tutor adotante
\`\`\`http
GET /api/visitas-acompanhamento/tutor/:tutorId
\`\`\`

#### Registrar visita
\`\`\`http
POST /api/visitas-acompanhamento
Content-Type: application/json

{
  "idPet": 1,
  "idTutor": 1,
  "idOng": 1,
  "dataVisita": "2025-11-30T14:00:00Z",
  "observacoes": "Pet está adaptando bem",
  "vacinado": true,
  "castrado": false,
  "descricaoSaude": "Saúde excelente, sem problemas"
}
\`\`\`

#### Atualizar visita
\`\`\`http
PUT /api/visitas-acompanhamento/:id
\`\`\`

#### Deletar visita
\`\`\`http
DELETE /api/visitas-acompanhamento/:id
\`\`\`

---

### COMPATIBILIDADE E BUSCA "QUERO ADOTAR"

#### Calcular compatibilidade
\`\`\`http
POST /api/compatibilidade/calcular
Content-Type: application/json

{
  "idAdotante": 1,
  "idPet": 1
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "idAdotante": 1,
  "idPet": 1,
  "pontuacaoTotal": 45,
  "compatibilidade": 72.5,
  "pontoEspecie": 20,
  "pontoRaca": 10,
  "pontoPorte": 10,
  "pontoSexo": 5,
  "pontoSaude": 5,
  "pontoSocial": 0,
  "fatorImpeditivo": false,
  "descricaoImpeditivo": null,
  "dataCriacaoRelatorio": "2025-11-23T15:30:00Z"
}
\`\`\`

#### Buscar pets compatíveis para adotante
\`\`\`http
GET /api/compatibilidade/adotante/:idAdotante/pets
\`\`\`

Retorna ranking de pets disponíveis ordenados por compatibilidade (maior para menor).

#### Buscar adotantes compatíveis para pet
\`\`\`http
GET /api/compatibilidade/pet/:idPet/adotantes
\`\`\`

Retorna ranking de adotantes ordenados por compatibilidade.

#### Listar relatórios de compatibilidade
\`\`\`http
GET /api/compatibilidade/relatorios
\`\`\`

#### Obter matches com alta compatibilidade
\`\`\`http
GET /api/compatibilidade/alto-compatibilidade?minScore=70
\`\`\`

Query parameters:
- `minScore` (default: 60) - Pontuação mínima de compatibilidade

---

### ACOMPANHAMENTO PÓS-ADOÇÃO

#### Gerar relatório de acompanhamento
\`\`\`http
POST /api/acompanhamento/relatorio
Content-Type: application/json

{
  "idPet": 1,
  "idTutor": 1,
  "dataAdocao": "2025-11-10T00:00:00Z"
}
\`\`\`

**Response:**
\`\`\`json
{
  "idPet": 1,
  "idTutor": 1,
  "dataAdocao": "2025-11-10T00:00:00Z",
  "diasAcompanhamento": 13,
  "totalVisitas": 2,
  "vacinado": true,
  "castrado": false,
  "ultimaVacina": "2025-11-23T14:00:00Z",
  "ultimaVisita": "2025-11-23T14:00:00Z",
  "incidentesSaude": [],
  "observacoesGerais": "Pet está adaptando-se bem ao novo lar.",
  "statusAcompanhamento": "ACOMPANHANDO"
}
\`\`\`

**statusAcompanhamento**: `ACOMPANHANDO`, `CONCLUIDO` (após 6 meses), `PROBLEMATICO`

#### Listar acompanhamentos por tutor
\`\`\`http
GET /api/acompanhamento/tutor/:tutorId
\`\`\`

#### Obter alertas de pets sem visitas
\`\`\`http
GET /api/acompanhamento/alertas?dias=30
\`\`\`

Query parameters:
- `dias` (default: 30) - Número de dias sem visitas para alertar

---

## Modelo de Dados - Compatibilidade

A compatibilidade é calculada usando a seguinte metodologia:

| Categoria | Condição | Pontos |
|-----------|----------|--------|
| **Espécie** | Mesma desejada | +20 |
| **Espécie** | Diferente desejada | -20 |
| **Raça** | Mesma desejada | +10 |
| **Raça** | Diferente desejada | -10 |
| **Porte** | Mesmo desejado | +10 |
| **Porte** | Diferente desejado | -10 |
| **Sexo** | Igual ao desejado | +5 |
| **Sexo** | Diferente desejado | -5 |
| **Saúde** | Com necessidades/tratamento (aceita) | +10 |
| **Saúde** | Sem necessidades (não aceita) | +10 |
| **Saúde** | Com doença crônica (aceita) | +10 |
| **Social** | Animal se dá bem com outros (adotante possui) | +5 |
| **Social** | Exige cuidados + disponibilidade | +5 |

**Fatores Impeditivos:**
- Animal não se adapta a convivência + adotante possui animais = ❌
- Exige cuidados + sem disponibilidade = ❌

**Fórmula**: `compatibilidade = max(0, min(100, (pontuacao_total + 100) / 2))`

---

## Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
npm run dev          # Inicia servidor com hot reload

# Produção
npm run build        # Compila TypeScript
npm run start        # Inicia servidor compilado

# Banco de dados
npx prisma migrate dev        # Cria nova migration
npx prisma db seed           # Executa seed
npx prisma studio           # Abre Prisma Studio (UI)

# Validação
npm run lint         # ESLint (se configurado)
\`\`\`

---

## Tratamento de Erros

A API retorna erros estruturados:

\`\`\`json
{
  "error": "Descrição do erro",
  "timestamp": "2025-11-23T15:30:00.000Z",
  "path": "/api/pets/999"
}
\`\`\`

### Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Deleção bem-sucedida
- `400 Bad Request` - Dados inválidos
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email duplicado)
- `429 Too Many Requests` - Rate limit atingido
- `500 Internal Server Error` - Erro no servidor

---

## Validações Implementadas

### Email
- Formato válido: `user@example.com`

### CEP (Brasil)
- Formato: `XXXXX-XXX` ou `XXXXXXXX`

### CNPJ (Brasil)
- Formato: `XX.XXX.XXX/XXXX-XX`

### Telefone (Brasil)
- Formato: `(XX) XXXXX-XXXX`

---

## Rate Limiting

A API implementa rate limiting básico:
- **Limite**: 1000 requisições por minuto por IP
- **Resposta ao limite**: HTTP 429 Too Many Requests

---

## Roadmap Futuro

- [ ] Autenticação JWT
- [ ] Integração com IA para compatibilidade avançada
- [ ] Sistema de notificações por email
- [ ] Dashboard administrativo
- [ ] Exportação de relatórios em PDF
- [ ] Mobile app (React Native)
- [ ] Testes automatizados (Jest)

---

## Contribuição

Para contribuir ao projeto:

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Licença

Este projeto é fornecido como está para fins educacionais.

---

## Contato

Projeto desenvolvido como parte da disciplina "Prática em Engenharia de Software"
Pontificia Universidade Católica do Rio Grande do Sul (PUCRS)

Professor: Filipo Mór
Email: filipo.mor@pucrs.br
