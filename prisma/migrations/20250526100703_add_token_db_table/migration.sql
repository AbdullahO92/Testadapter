/*
  Warnings:

  - You are about to drop the column `externalToken` on the `ExternalIdentity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "externalToken";

-- CreateTable
CREATE TABLE "ExternalIdentityToken" (
    "id" TEXT NOT NULL,
    "token" VARCHAR(8192),
    "generatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshExpiryDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "externalIdentityId" TEXT NOT NULL,

    CONSTRAINT "ExternalIdentityToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "responseName" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "updatedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "messageHash" VARCHAR(256),

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentityToken_externalIdentityId_key" ON "ExternalIdentityToken"("externalIdentityId");

-- AddForeignKey
ALTER TABLE "ExternalIdentityToken" ADD CONSTRAINT "ExternalIdentityToken_externalIdentityId_fkey" FOREIGN KEY ("externalIdentityId") REFERENCES "ExternalIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
