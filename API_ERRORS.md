# Guia de Erros da API AuConchego

## Erros Comuns

### 400 Bad Request

#### Email inválido
\`\`\`json
{
  "error": "Email inválido",
  "path": "/api/adotantes"
}
\`\`\`

**Solução**: Verifique se o email está no formato `user@example.com`

#### CEP inválido
\`\`\`json
{
  "error": "CEP inválido (formato: XXXXX-XXX ou XXXXXXXX)"
}
\`\`\`

**Solução**: Use o formato `90000-000` ou `90000000`

#### Dados obrigatórios faltando
\`\`\`json
{
  "error": "Nome do pet é obrigatório"
}
\`\`\`

**Solução**: Verifique se todos os campos obrigatórios foram enviados

---

### 404 Not Found

#### Recurso não encontrado
\`\`\`json
{
  "error": "Pet não encontrado",
  "path": "/api/pets/999"
}
\`\`\`

**Solução**: Verifique se o ID está correto

---

### 409 Conflict

#### Email duplicado
\`\`\`json
{
  "error": "email já existe no banco de dados"
}
\`\`\`

**Solução**: Use um email diferente ou atualize o registro existente

---

### 429 Too Many Requests

\`\`\`json
{
  "error": "Muitas requisições, tente novamente mais tarde"
}
\`\`\`

**Solução**: Aguarde antes de fazer novas requisições. Rate limit: 1000 req/min

---

### 500 Internal Server Error

\`\`\`json
{
  "error": "Erro interno do servidor",
  "timestamp": "2025-11-23T15:30:00.000Z"
}
\`\`\`

**Solução**: Contate o administrador ou verifique os logs do servidor

---

## Debugging

### Verificar logs do servidor
\`\`\`bash
npm run dev
# Observe a saída do console
\`\`\`

### Usar ferramentas como Postman ou Insomnia
- Copie a requisição da documentação
- Verifique os headers
- Inspecione a resposta

### Verificar banco de dados
\`\`\`bash
npx prisma studio
# Abre interface visual para inspecionar dados
\`\`\`

---

## Checklist de Troubleshooting

- [ ] Servidor está rodando?
- [ ] URL está correta? (http://localhost:3333/api/...)
- [ ] Dados são válidos? (email, CEP, telefone, etc)
- [ ] Content-Type header está definido como `application/json`?
- [ ] ID existe no banco?
- [ ] Rate limit foi atingido?
