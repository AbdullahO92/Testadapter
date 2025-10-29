/*
  Warnings:

  - A unique constraint covering the columns `[dataAdapterId]` on the table `ExternalIdentityToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataAdapterId` to the `ExternalIdentityToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalIdentityToken" ADD COLUMN     "dataAdapterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentityToken_dataAdapterId_key" ON "ExternalIdentityToken"("dataAdapterId");

-- AddForeignKey
ALTER TABLE "ExternalIdentityToken" ADD CONSTRAINT "ExternalIdentityToken_dataAdapterId_fkey" FOREIGN KEY ("dataAdapterId") REFERENCES "DataAdapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
