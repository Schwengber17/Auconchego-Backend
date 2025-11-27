-- AlterTable
ALTER TABLE "adotante" ADD COLUMN     "experiencia" BOOLEAN,
ADD COLUMN     "idade_maxima" INTEGER,
ADD COLUMN     "idade_minima" INTEGER,
ADD COLUMN     "peso_maximo" DOUBLE PRECISION,
ADD COLUMN     "peso_minimo" DOUBLE PRECISION,
ADD COLUMN     "prefer_castrado" BOOLEAN,
ADD COLUMN     "prefer_localizacao" TEXT,
ADD COLUMN     "prefer_temperamento" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prefer_vacinado" BOOLEAN,
ADD COLUMN     "tempo_casa" TEXT,
ADD COLUMN     "tipo_moradia" TEXT;

-- AlterTable
ALTER TABLE "relatorio_compatibilidade" ADD COLUMN     "ponto_ambiente" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_castracao" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_idade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_localizacao" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_peso" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_temperamento" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ponto_vacinacao" INTEGER NOT NULL DEFAULT 0;
