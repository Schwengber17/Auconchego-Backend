# Guia de Integração Frontend — API AuConchego

Este documento descreve os endpoints disponíveis no backend AuConchego, o formato esperado de requests/responses e recomendações práticas para o frontend (validações, exemplos de fetch, tratamento de erros).

Base URL (desenvolvimento): `http://localhost:3333/api`

Observações gerais
- CORS: o backend já permite `http://localhost:3000` por padrão (ver `.env`). Ajuste se o frontend rodar em outra origem.
- Autenticação: não há autenticação nas rotas atuais. Se for adicionada, inclua `Authorization: Bearer <token>` nos requests necessários.
- Formato: use JSON com nomes em camelCase (ex.: `idOng`, `dataResgate`, `descricaoSaude`). Enums em UPPERCASE.
- Datas: envie ISO strings (ex.: `new Date().toISOString()`).

---

## 1) Pets

- `GET /pets`
  - O que faz: lista todos os pets.
  - Response: `200` + array de pets.

- `GET /pets/:id`
  - O que faz: retorna pet por id.
  - Response: `200` + pet | `400` id inválido | `404` não encontrado.

- `POST /pets`
  - O que faz: cria novo pet.
  - Body (JSON) principal:
    ```json
    {
      "nome": "Max",
      "especie": "Cachorro",
      "raca": "Labrador",
      "porte": "GRANDE",
      "sexo": "MACHO",
      "status": "DISPONIVEL",
      "dataResgate": "2025-11-01T00:00:00.000Z",
      "descricao": "texto",
      "necessidadesEspeciais": false,
      "tratamentoContinuo": false,
      "doencaCronica": false,
      "descricaoSaude": "texto",
      "idOng": 1,
      "idTutorOrigem": 1
    }
    ```
  - Response: `201` + pet criado | `400` validação / FK inválida.

- `PUT /pets/:id` — atualiza campos do pet; Response `200` ou `404`.
- `DELETE /pets/:id` — remove pet; Response `204`.

Frontend: validar campos obrigatórios antes do envio (nome, especie, raca, porte, sexo, idOng). Em criação, trate `201` navegando para o detalhe; trate `400` exibindo validações.

Exemplo fetch (criar):
```js
await fetch('/api/pets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Spike', especie: 'Cachorro', raca: 'Pit Bull', porte: 'GRANDE', sexo: 'MACHO', idOng: 1 })
})
```

---

## 2) Tutores

- `GET /tutores` — lista tutores (`200`).
- `GET /tutores/:id` — detalhe tutor (`200`/`400`/`404`).
- `POST /tutores` — cria tutor.
  - Body (obrigatórios):
    ```json
    {
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "11999999999",
      "endereco": "Rua A, 123",
      "cidade": "Porto Alegre",
      "estado": "RS",
      "cep": "01310100",
      "idOng": 1
    }
    ```
  - Response: `201` ou `400`.
- `PUT /tutores/:id` — atualiza; `DELETE /tutores/:id` — `204`.

Frontend: formulário com validação dos campos obrigatórios. Em caso de erro 400, mostrar indicação dos campos faltantes/invalidos.

---

## 3) Adotantes

- `GET /adotantes` — lista adotantes (`200`).
- `GET /adotantes/:id` — detalhe (`200`/`400`/`404`).
- `POST /adotantes` — cria adotante.
  - Body exemplo:
    ```json
    {
      "nome":"Maria Santos",
      "email":"maria@example.com",
      "telefone":"11988888888",
      "endereco":"Avenida B, 456",
      "cidade":"Curitiba",
      "estado":"PR",
      "cep":"02145000",
      "especieDesejada":"Gato",
      "racaDesejada":"SRD",
      "porteDesejado":"PEQUENO",
      "sexoDesejado":"FEMEA",
      "aceitaNecessidadesEsp": true,
      "aceitaTratamentoContinuo": false,
      "aceitaDoencaCronica": false,
      "temOutrosAnimais": false,
      "possuiDisponibilidade": true,
      "statusBusca": "PENDENTE"
    }
    ```
  - Response: `201` ou `400`.
- `PUT /adotantes/:id` — atualizar; `DELETE /adotantes/:id` — deletar.

Frontend: formulário de preferências; normalize campos e enums (UPPERCASE). Tratar erros retornados do backend.

---

## 4) Histórico de Localização

- `GET /historico-localizacao` — lista (`200`).
- `GET /historico-localizacao/:id` — detalhe (`200`/`404`).
- `GET /historico-localizacao/pet/:petId` — histórico de um pet (`200`).
- `POST /historico-localizacao` — cria histórico. Body exemplo:
  ```json
  {
    "idPet": 1,
    "tipo": "RESGATE",
    "local": "Parque X",
    "descricao": "encontrado",
    "dataInicio": "2025-11-01T00:00:00.000Z",
    "dataFim": "2025-11-05T00:00:00.000Z"
  }
  ```
- `PUT` / `DELETE` correspondentes.

Frontend: vincule histórico ao pet selecionado; envie datas em ISO.

---

## 5) Visitas de Acompanhamento

- `GET /visitas-acompanhamento` — lista (`200`).
- `GET /visitas-acompanhamento/:id` — detalhe (`200`/`404`).
- `GET /visitas-acompanhamento/pet/:petId` — por pet.
- `GET /visitas-acompanhamento/tutor/:tutorId` — por tutor.
- `POST /visitas-acompanhamento` — cria visita. Body exemplo:
  ```json
  {
    "idPet":1,
    "idTutor":1,
    "idOng":1,
    "dataVisita":"2025-11-23T10:00:00.000Z",
    "observacoes":"checagem",
    "vacinado":true,
    "castrado":false,
    "descricaoSaude":"ok"
  }
  ```

Frontend: use calendário/listas; filtre por pet/tutor com os endpoints específicos.

---

## 6) Compatibilidade

- `POST /compatibilidade/calcular` — calcula e grava relatório.
  - Body: `{ "idAdotante": 1, "idPet": 2 }`.
  - Response: `201` + relatório.
- `GET /compatibilidade/adotante/:idAdotante/pets` — pets compatíveis.
- `GET /compatibilidade/pet/:idPet/adotantes` — adotantes compatíveis.
- `GET /compatibilidade/relatorios` — lista relatórios.
- `GET /compatibilidade/alto-compatibilidade?minScore=60` — relatórios >= minScore.

Frontend: para sugestões, chame `/compatibilidade/adotante/:id/pets`. Para comparação individual, `POST /compatibilidade/calcular` e exiba `pontuacao_total`, `compatibilidade`, e pontos por categoria.

---

## Pedido de Adoção (Adoption Request)

Este fluxo permite que um adotante solicite a adoção de um pet e que o tutor ou a ONG responsável analisem e respondam (aprovar/rejeitar).

- `POST /pets/:id/adoption-requests`
  - O que faz: cria um pedido de adoção para o pet `:id`.
  - Body (JSON):
    ```json
    { "idAdotante": 1, "message": "Tenho espaço e tempo pra cuidar" }
    ```
  - Response: `201` + objeto `AdoptionRequest` (status inicial `PENDENTE`) | `400` validação.
  - Efeito colateral: ao criar o primeiro pedido para um `pet` que está `DISPONIVEL`, o backend marca o `pet.status` como `RESERVADO` para sinalizar que o animal está sob análise. Se todos os pedidos pendentes forem rejeitados, o `pet.status` é revertido para `DISPONIVEL`.

- `GET /adoption-requests?petId=&adotanteId=&status=`
  - O que faz: lista pedidos filtrando por `petId`, `adotanteId`, `status` (opcional).
  - Response: `200` + array de pedidos.

- `GET /adoption-requests/:id`
  - O que faz: retorna detalhe do pedido.
  - Response: `200` + pedido | `404`.

- `PUT /adoption-requests/:id/approve`
  - O que faz: aprova o pedido de adoção.
  - Body (JSON): `{ "responderId": 1, "responderType": "TUTOR" }` onde `responderType` é `TUTOR` ou `ONG`.
  - Regras de negócio importantes:
    - O backend valida que o `responderId` pertence ao tutor ou ONG responsável pelo pet.
    - Em caso de aprovação, o pedido passa para `APROVADA`, o `pet.status` passa para `ADOTADO` e `pet.idTutorAdotante` é setado com o `adotanteId` do pedido.
    - Outros pedidos `PENDENTE` para o mesmo pet são automaticamente marcados como `REJEITADA`.
  - Response: `200` + pedido atualizado ou `400`/`403` se não autorizado.

- `PUT /adoption-requests/:id/reject`
  - O que faz: rejeita o pedido.
  - Body (JSON): `{ "responderId": 1, "responderType": "ONG", "reason": "Não atende critérios" }` (reason opcional).
  - Em caso de rejeição, o pedido passa para `REJEITADA`; o pet permanece com `status` atual.

Frontend contract / fluxo recomendado:

- Criação do pedido (Adotante):
  1. O adotante clica em "Solicitar Adoção" na página do pet.
  2. Front envia `POST /pets/:id/adoption-requests` com `{ idAdotante, message }`.
  3. Tratar `201` mostrando confirmação; em `400` mostrar validações.

- Painel do Tutor/ONG (responder pedidos):
  1. O tutor/ONG lista pedidos pendentes pelos seus pets: obter lista de pets do tutor/ong e para cada pet chamar `GET /adoption-requests?petId=<petId>&status=PENDENTE`, ou o backend pode ser estendido para filtrar por `tutorId`/`ongId`.
  2. Ao aprovar, o front chama `PUT /adoption-requests/:id/approve` com `{ responderId, responderType }` — **use o id real do tutor ou da ong**.
  3. Ao rejeitar, chamar `PUT /adoption-requests/:id/reject` com `{ responderId, responderType, reason }`.

Recomendações de UI e UX:

- Mostrar o `message` do adotante e dados de contato quando o tutor/ONG avaliar.
- Após aprovação, refrescar o detalhe do pet (`GET /pets/:id`) para refletir `status: ADOTADO` e `idTutorAdotante`.
- Implementar confirmação/aviso antes de aprovar (ação irreversível no fluxo atual).

Exemplo fetch (criar pedido):
```js
await fetch(`/api/pets/${petId}/adoption-requests`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idAdotante: adotanteId, message: 'Tenho experiência com animais' })
})
```

Exemplo fetch (aprovar como tutor):
```js
await fetch(`/api/adoption-requests/${requestId}/approve`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ responderId: tutorId, responderType: 'TUTOR' })
})
```

Segurança / próximos passos:

- Atualmente a rota aceita `responderId` e `responderType` no body — recomendamos implementar autenticação (JWT) e middleware que extraia o `userId` do token para evitar spoofing.
- Em produção, registre logs/alertas ao aprovar pedidos e considerar um fluxo de confirmação (ex.: contato telefônico/visita) antes de tornar o pet definitivamente `ADOTADO`.

---

## 7) Acompanhamento pós-adoção (Relatórios)

- `POST /acompanhamento/relatorio` — gera relatório de acompanhamento.
  - Body obrigatório: `{ "idPet":1, "idTutor":1, "dataAdocao":"2025-11-01" }`.
  - Response: `200` + relatorio.
- `GET /acompanhamento/tutor/:tutorId` — lista por tutor.
- `GET /acompanhamento/alertas?dias=30` — retorna alertas (pets sem visita há X dias).

Frontend: após adoção chame `POST /acompanhamento/relatorio`. Mostre alertas no painel do tutor.

---

## Erros e Códigos HTTP comuns

- `200` OK — sucesso em GET/PUT.
- `201` Created — sucesso em POST.
- `204` No Content — sucesso em DELETE.
- `400` Bad Request — dados inválidos / validação Falhou.
- `404` Not Found — recurso não existe.
- `500` Internal Server Error — erro servidor.

## Boas práticas para o frontend

- Validar localmente campos obrigatórios e formatos antes do POST/PUT.
- Enums em UPPERCASE.
- Enviar datas em ISO (`toISOString()`).
- Tratar respostas `400` mostrando mensagens ao usuário; `404` como "não encontrado"; `500` com fallback genérico.
- Paginação: atualmente não suportada pelo backend — se necessário, peça ao backend para adicionar query params `?page=&limit=`.

## Exemplos rápidos (fetch)

GET list:
```js
const res = await fetch('/api/pets')
if (res.ok) { const pets = await res.json() }
```

POST compatibility:
```js
const res = await fetch('/api/compatibilidade/calcular', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ idAdotante: 1, idPet: 2 })
})
if (res.status === 201) { const rel = await res.json() }
```

---

## Health check

- O backend atual não expõe `/health` (o teste mostrou `404`). Para health checks, use uma rota funcional como `GET /api/pets` ou peça para adicionar `GET /health` que retorne `200`.

---

## Próximos passos que eu posso ajudar a implementar

- Gerar componentes React de exemplo (form Pet / Tutores / Adotantes).
- Adicionar rota `GET /health` no backend.
- Adicionar paginação e filtros no backend.
- Converter exemplos para Axios / React Query.

Se quiser que eu gere um componente exemplo ou adicione a rota `/health`, diga qual opção prefere.
