/*
  Warnings:

  - Added the required column `adapterId` to the `DataAdapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataAdapter" ADD COLUMN     "adapterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DataAdapter" ADD CONSTRAINT "DataAdapter_adapterId_fkey" FOREIGN KEY ("adapterId") REFERENCES "Adapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
