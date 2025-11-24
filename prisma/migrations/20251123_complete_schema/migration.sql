-- CreateEnum for new statuses
CREATE TYPE "StatusAdocao" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'CONCLUIDA');
CREATE TYPE "TipoLocalizacao" AS ENUM ('RESGATE', 'TRANSITO', 'ABRIGO', 'OUTRO');

-- Add new fields to ong table
ALTER TABLE "ong" ADD COLUMN "nome" TEXT NOT NULL DEFAULT 'ONG Padrão';
ALTER TABLE "ong" ADD COLUMN "telefone" TEXT;
ALTER TABLE "ong" ADD COLUMN "email" TEXT;

-- Modify pet table
ALTER TABLE "pet" ADD COLUMN "data_resgate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "pet" ADD COLUMN "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "pet" ADD COLUMN "descricao" TEXT;
ALTER TABLE "pet" ADD COLUMN "descricao_saude" TEXT;
ALTER TABLE "pet" ADD COLUMN "id_tutor_origem" INTEGER;
ALTER TABLE "pet" ADD COLUMN "id_tutor_adotante" INTEGER;

-- Create tutor table
CREATE TABLE "tutor" (
    "id_tutor" SERIAL NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_ong" INTEGER NOT NULL,
    CONSTRAINT "tutor_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong" ("id_ong") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create adotante table
CREATE TABLE "adotante" (
    "id_adotante" SERIAL NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "especie_desejada" TEXT NOT NULL,
    "raca_desejada" TEXT,
    "porte_desejado" TEXT,
    "sexo_desejado" TEXT,
    "aceita_necessidades_esp" BOOLEAN NOT NULL DEFAULT false,
    "aceita_tratamento_continuo" BOOLEAN NOT NULL DEFAULT false,
    "aceita_doenca_cronica" BOOLEAN NOT NULL DEFAULT false,
    "tem_outros_animais" BOOLEAN NOT NULL DEFAULT false,
    "possui_disponibilidade" BOOLEAN NOT NULL DEFAULT true,
    "pet_buscado" INTEGER,
    "status_busca" "StatusAdocao" NOT NULL DEFAULT 'PENDENTE',
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create historico_localizacao table
CREATE TABLE "historico_localizacao" (
    "id_historico" SERIAL NOT NULL PRIMARY KEY,
    "id_pet" INTEGER NOT NULL,
    "tipo" "TipoLocalizacao" NOT NULL,
    "local" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_localizacao_id_pet_fkey" FOREIGN KEY ("id_pet") REFERENCES "pet" ("id_pet") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create visita_acompanhamento table
CREATE TABLE "visita_acompanhamento" (
    "id_visita" SERIAL NOT NULL PRIMARY KEY,
    "id_pet" INTEGER NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_ong" INTEGER NOT NULL,
    "data_visita" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,
    "vacinado" BOOLEAN NOT NULL DEFAULT false,
    "castrado" BOOLEAN NOT NULL DEFAULT false,
    "descricao_saude" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "visita_acompanhamento_id_pet_fkey" FOREIGN KEY ("id_pet") REFERENCES "pet" ("id_pet") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visita_acompanhamento_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "tutor" ("id_tutor") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "visita_acompanhamento_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong" ("id_ong") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create relatorio_compatibilidade table
CREATE TABLE "relatorio_compatibilidade" (
    "id_relatorio" SERIAL NOT NULL PRIMARY KEY,
    "id_adotante" INTEGER NOT NULL,
    "id_pet" INTEGER NOT NULL,
    "pontuacao_total" INTEGER NOT NULL,
    "compatibilidade" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ponto_especie" INTEGER NOT NULL DEFAULT 0,
    "ponto_raca" INTEGER NOT NULL DEFAULT 0,
    "ponto_porte" INTEGER NOT NULL DEFAULT 0,
    "ponto_sexo" INTEGER NOT NULL DEFAULT 0,
    "ponto_saude" INTEGER NOT NULL DEFAULT 0,
    "ponto_social" INTEGER NOT NULL DEFAULT 0,
    "fator_impeditivo" BOOLEAN NOT NULL DEFAULT false,
    "descricao_impeditivo" TEXT,
    "data_criacao_relatorio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "relatorio_compatibilidade_id_adotante_fkey" FOREIGN KEY ("id_adotante") REFERENCES "adotante" ("id_adotante") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "relatorio_compatibilidade_id_pet_fkey" FOREIGN KEY ("id_pet") REFERENCES "pet" ("id_pet") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add foreign key constraints to pet table
ALTER TABLE "pet" ADD CONSTRAINT "pet_id_tutor_origem_fkey" FOREIGN KEY ("id_tutor_origem") REFERENCES "tutor" ("id_tutor") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pet" ADD CONSTRAINT "pet_id_tutor_adotante_fkey" FOREIGN KEY ("id_tutor_adotante") REFERENCES "tutor" ("id_tutor") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "historico_localizacao_id_pet_idx" ON "historico_localizacao"("id_pet");
CREATE INDEX "historico_localizacao_data_inicio_idx" ON "historico_localizacao"("data_inicio");
CREATE INDEX "visita_acompanhamento_id_pet_idx" ON "visita_acompanhamento"("id_pet");
CREATE INDEX "visita_acompanhamento_id_tutor_idx" ON "visita_acompanhamento"("id_tutor");
CREATE INDEX "visita_acompanhamento_data_visita_idx" ON "visita_acompanhamento"("data_visita");
CREATE INDEX "relatorio_compatibilidade_id_adotante_idx" ON "relatorio_compatibilidade"("id_adotante");
CREATE INDEX "relatorio_compatibilidade_id_pet_idx" ON "relatorio_compatibilidade"("id_pet");
CREATE INDEX "relatorio_compatibilidade_compatibilidade_idx" ON "relatorio_compatibilidade"("compatibilidade");
