/*
  Warnings:

  - You are about to drop the column `userPreferenceId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropIndex
DROP INDEX "User_userPreferenceId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPreferenceId";

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
