# Guia de Deployment - AuConchego

## Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado e rodando
- npm ou yarn
- Conta em um serviço de hospedagem (Vercel, Heroku, AWS, etc.)

---

## Deployment Local

### 1. Preparar o ambiente

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente

Crie arquivo `.env.local` com suas variáveis:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/auconchego"
PORT=3333
NODE_ENV="production"
CORS_ORIGIN="http://seu-frontend.com"
\`\`\`

### 3. Build do projeto

\`\`\`bash
npm run build
\`\`\`

### 4. Executar migrações

\`\`\`bash
npx prisma migrate deploy
\`\`\`

### 5. Iniciar servidor

\`\`\`bash
npm start
\`\`\`

---

## Deployment em Produção

### Opção 1: Vercel + PostgreSQL (Recomendado para Prototipagem)

#### 1. Prepare o repositório GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/auconchego-backend.git
git push -u origin main
\`\`\`

#### 2. Configure no Vercel

- Acesse [vercel.com](https://vercel.com)
- Clique "New Project"
- Conecte seu repositório GitHub
- Configure variáveis de ambiente no dashboard

#### 3. Configure Database (Vercel Postgres ou Neon)

**Opção A: Vercel Postgres**
\`\`\`bash
# Na pasta do projeto
npm install @vercel/postgres
\`\`\`

**Opção B: Neon (PostgreSQL Serverless)**
- Acesse [neon.tech](https://neon.tech)
- Crie um projeto
- Copie a connection string do Neon
- Adicione como `DATABASE_URL` no Vercel

#### 4. Atualize package.json

\`\`\`json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "vercel-build": "npm run build && npx prisma generate && npx prisma migrate deploy"
  }
}
\`\`\`

#### 5. Crie arquivo `vercel.json`

\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
\`\`\`

#### 6. Deploy

\`\`\`bash
# Vercel CLI
npm install -g vercel
vercel
\`\`\`

---

### Opção 2: Heroku

#### 1. Prepare Heroku CLI

\`\`\`bash
# Instale Heroku CLI
# macOS: brew tap heroku/brew && brew install heroku
# Windows: https://devcenter.heroku.com/articles/heroku-cli
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

heroku login
\`\`\`

#### 2. Crie aplicação Heroku

\`\`\`bash
heroku create seu-app-name
\`\`\`

#### 3. Configure PostgreSQL

\`\`\`bash
heroku addons:create heroku-postgresql:hobby-dev
\`\`\`

#### 4. Configure variáveis de ambiente

\`\`\`bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3333
heroku config:set CORS_ORIGIN=https://seu-frontend.herokuapp.com
\`\`\`

#### 5. Deploy

\`\`\`bash
git push heroku main
\`\`\`

#### 6. Executar migrações

\`\`\`bash
heroku run npx prisma migrate deploy
\`\`\`

---

### Opção 3: AWS EC2

#### 1. Crie instância EC2

- Ubuntu 20.04 LTS recomendado
- Tipo: t2.micro (free tier)
- Configure security groups (porta 3333 aberta)

#### 2. Conecte via SSH

\`\`\`bash
ssh -i seu-key.pem ubuntu@seu-ip-publico
\`\`\`

#### 3. Configure servidor

\`\`\`bash
# Atualize sistema
sudo apt update && sudo apt upgrade -y

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instale PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instale PM2 (process manager)
sudo npm install -g pm2
\`\`\`

#### 4. Clone projeto

\`\`\`bash
git clone https://github.com/seu-usuario/auconchego-backend.git
cd auconchego-backend
npm install
npm run build
\`\`\`

#### 5. Configure banco de dados

\`\`\`bash
# Crie banco PostgreSQL
sudo -u postgres createdb auconchego
sudo -u postgres createuser auconchego_user
\`\`\`

#### 6. Configure variáveis de ambiente

\`\`\`bash
# Crie .env
echo "DATABASE_URL=postgresql://auconchego_user:senha@localhost:5432/auconchego" > .env
echo "NODE_ENV=production" >> .env
echo "PORT=3333" >> .env
\`\`\`

#### 7. Inicie com PM2

\`\`\`bash
# Execute migrações
npx prisma migrate deploy

# Inicie com PM2
pm2 start dist/server.js --name "auconchego"

# Configure para iniciar no boot
pm2 startup
pm2 save
\`\`\`

#### 8. Configure Nginx (proxy reverso)

\`\`\`bash
sudo apt install -y nginx

# Configure /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
\`\`\`

\`\`\`nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

\`\`\`bash
# Reinicie Nginx
sudo systemctl restart nginx
\`\`\`

---

## Monitoramento em Produção

### Logs

**Vercel:**
\`\`\`bash
vercel logs seu-app-name
\`\`\`

**Heroku:**
\`\`\`bash
heroku logs --tail
\`\`\`

**EC2/PM2:**
\`\`\`bash
pm2 logs auconchego
\`\`\`

### Health Check

\`\`\`bash
curl https://seu-app.com/health
# Response: {"status":"OK","timestamp":"2025-11-23T15:30:00.000Z"}
\`\`\`

---

## Backup do Banco de Dados

### PostgreSQL Local

\`\`\`bash
# Backup completo
pg_dump auconchego > backup_$(date +%Y%m%d).sql

# Restaurar
psql auconchego < backup.sql
\`\`\`

### Vercel Postgres

Backups automáticos inclusos na plataforma.

### Heroku PostgreSQL

\`\`\`bash
# Criar backup
heroku pg:backups:capture

# Listar backups
heroku pg:backups

# Restaurar
heroku pg:backups:restore [ID]
\`\`\`

---

## Troubleshooting

### Erro: "DATABASE_URL não definida"

- Verifique se variável foi adicionada corretamente
- Restart do servidor pode ser necessário

### Erro: "Port 3333 already in use"

\`\`\`bash
# Kill processo na porta
lsof -i :3333
kill -9 PID
\`\`\`

### Erro: "Prisma connection timeout"

- Verifique conexão com banco
- Aumentar timeout em .env ou schema.prisma

### Erro: "CORS policy blocked"

- Verifique CORS_ORIGIN está configurado corretamente
- Frontend URL deve estar exatamente igual

---

## Performance Tips

1. **Ative caching** em endpoints GET
2. **Use índices** no banco (já adicionados)
3. **Implemente rate limiting** (já implementado)
4. **Monitore queries lentas**
5. **Use CDN** para assets estáticos

---

## Segurança em Produção

- [ ] Usar HTTPS/SSL
- [ ] Configurar CORS apropriadamente
- [ ] Implementar autenticação (JWT)
- [ ] Usar variáveis de ambiente para secrets
- [ ] Manter dependências atualizadas
- [ ] Implementar CSRF protection
- [ ] Validar e sanitizar inputs
- [ ] Usar rate limiting

---

## CI/CD com GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm run test
      # Deploy para Vercel/Heroku aqui
\`\`\`

---

Sucesso no deployment! Para dúvidas, consulte a documentação específica de cada plataforma.
