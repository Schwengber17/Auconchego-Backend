-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_id_ong_fkey";

-- AlterTable
ALTER TABLE "pet" ALTER COLUMN "id_ong" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong"("id_ong") ON DELETE SET NULL ON UPDATE CASCADE;
