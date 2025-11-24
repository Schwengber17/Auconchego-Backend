/*
  Warnings:

  - You are about to drop the column `especie_desejada` on the `adotante` table. All the data in the column will be lost.
  - You are about to drop the column `porte_desejado` on the `adotante` table. All the data in the column will be lost.
  - You are about to drop the column `raca_desejada` on the `adotante` table. All the data in the column will be lost.
  - You are about to drop the column `sexo_desejado` on the `adotante` table. All the data in the column will be lost.
  - Added the required column `especieDesejada` to the `adotante` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "historico_localizacao_data_inicio_idx";

-- DropIndex
DROP INDEX "historico_localizacao_id_pet_idx";

-- DropIndex
DROP INDEX "relatorio_compatibilidade_compatibilidade_idx";

-- DropIndex
DROP INDEX "relatorio_compatibilidade_id_adotante_idx";

-- DropIndex
DROP INDEX "relatorio_compatibilidade_id_pet_idx";

-- DropIndex
DROP INDEX "visita_acompanhamento_data_visita_idx";

-- DropIndex
DROP INDEX "visita_acompanhamento_id_pet_idx";

-- DropIndex
DROP INDEX "visita_acompanhamento_id_tutor_idx";

-- AlterTable
ALTER TABLE "adotante" DROP COLUMN "especie_desejada",
DROP COLUMN "porte_desejado",
DROP COLUMN "raca_desejada",
DROP COLUMN "sexo_desejado",
ADD COLUMN     "especieDesejada" TEXT NOT NULL,
ADD COLUMN     "porteDesejado" TEXT,
ADD COLUMN     "racaDesejada" TEXT,
ADD COLUMN     "sexoDesejado" TEXT;

-- AlterTable
ALTER TABLE "ong" ALTER COLUMN "nome" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pet" ALTER COLUMN "data_resgate" DROP DEFAULT;
