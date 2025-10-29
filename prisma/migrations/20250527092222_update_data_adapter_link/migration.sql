/*
  Warnings:

  - You are about to drop the column `adapterId` on the `ExternalIdentity` table. All the data in the column will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dataAdapterId` to the `ExternalIdentity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExternalIdentity" DROP CONSTRAINT "ExternalIdentity_adapterId_fkey";

-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "adapterId",
ADD COLUMN     "dataAdapterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "State";

-- AddForeignKey
ALTER TABLE "ExternalIdentity" ADD CONSTRAINT "ExternalIdentity_dataAdapterId_fkey" FOREIGN KEY ("dataAdapterId") REFERENCES "DataAdapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
