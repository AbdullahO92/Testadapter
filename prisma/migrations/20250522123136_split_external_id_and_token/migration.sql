/*
  Warnings:

  - You are about to drop the column `extId` on the `ExternalIdentity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "extId",
ADD COLUMN     "externalId" VARCHAR(128),
ADD COLUMN     "externalToken" VARCHAR(128);
