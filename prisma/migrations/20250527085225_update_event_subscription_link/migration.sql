/*
  Warnings:

  - You are about to drop the column `studentId` on the `EventSubscription` table. All the data in the column will be lost.
  - Added the required column `externalIdentityId` to the `EventSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventSubscription" DROP CONSTRAINT "EventSubscription_studentId_fkey";

-- AlterTable
ALTER TABLE "EventSubscription" DROP COLUMN "studentId",
ADD COLUMN     "externalIdentityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventSubscription" ADD CONSTRAINT "EventSubscription_externalIdentityId_fkey" FOREIGN KEY ("externalIdentityId") REFERENCES "ExternalIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
