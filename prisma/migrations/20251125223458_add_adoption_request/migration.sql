-- AlterTable
ALTER TABLE "pet" ADD COLUMN     "castrado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idade" INTEGER,
ADD COLUMN     "local" TEXT,
ADD COLUMN     "peso" DOUBLE PRECISION,
ADD COLUMN     "temperamento" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vacinado" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "adoption_request" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "adotanteId" INTEGER NOT NULL,
    "status" "StatusAdocao" NOT NULL DEFAULT 'PENDENTE',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "responderId" INTEGER,
    "responderType" TEXT,
    "reason" TEXT,

    CONSTRAINT "adoption_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "adoption_request" ADD CONSTRAINT "adoption_request_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pet"("id_pet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_request" ADD CONSTRAINT "adoption_request_adotanteId_fkey" FOREIGN KEY ("adotanteId") REFERENCES "adotante"("id_adotante") ON DELETE RESTRICT ON UPDATE CASCADE;
