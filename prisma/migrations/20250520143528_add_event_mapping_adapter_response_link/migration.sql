/*
  Warnings:

  - Added the required column `adapterResponseId` to the `EventMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventMapping" ADD COLUMN     "adapterResponseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventMapping" ADD CONSTRAINT "EventMapping_adapterResponseId_fkey" FOREIGN KEY ("adapterResponseId") REFERENCES "AdapterResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
