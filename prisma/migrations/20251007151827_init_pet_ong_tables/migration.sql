-- CreateEnum
CREATE TYPE "Porte" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MACHO', 'FEMEA');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DISPONIVEL', 'ADOTADO', 'RESERVADO');

-- CreateTable
CREATE TABLE "pet" (
    "id_pet" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "porte" "Porte" NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'DISPONIVEL',
    "necessidades_especiais" BOOLEAN NOT NULL,
    "tratamento_continuo" BOOLEAN NOT NULL,
    "doenca_cronica" BOOLEAN NOT NULL,
    "id_ong" INTEGER NOT NULL,

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id_pet")
);

-- CreateTable
CREATE TABLE "ong" (
    "id_ong" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,

    CONSTRAINT "ong_pkey" PRIMARY KEY ("id_ong")
);

-- CreateIndex
CREATE UNIQUE INDEX "ong_cnpj_key" ON "ong"("cnpj");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong"("id_ong") ON DELETE RESTRICT ON UPDATE CASCADE;
