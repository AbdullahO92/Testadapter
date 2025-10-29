/*
  Warnings:

  - You are about to drop the column `systemName` on the `ExternalIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `systemType` on the `ExternalIdentity` table. All the data in the column will be lost.
  - Added the required column `instituteId` to the `DataAdapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataAdapter" ADD COLUMN     "instituteId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "systemName",
DROP COLUMN "systemType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instituteId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Institute" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAdapter" ADD CONSTRAINT "DataAdapter_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
