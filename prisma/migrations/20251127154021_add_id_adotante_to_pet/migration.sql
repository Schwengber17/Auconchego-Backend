-- AlterTable
ALTER TABLE "pet" ADD COLUMN     "id_adotante" INTEGER;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_id_adotante_fkey" FOREIGN KEY ("id_adotante") REFERENCES "adotante"("id_adotante") ON DELETE SET NULL ON UPDATE CASCADE;
