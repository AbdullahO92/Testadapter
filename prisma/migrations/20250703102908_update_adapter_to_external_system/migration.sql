/*
  Warnings:

  - You are about to drop the column `adapterResponseId` on the `EventMapping` table. All the data in the column will be lost.
  - You are about to drop the column `dataAdapterId` on the `EventMapping` table. All the data in the column will be lost.
  - You are about to drop the column `dataAdapterId` on the `ExternalIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `dataAdapterId` on the `ExternalIdentityToken` table. All the data in the column will be lost.
  - You are about to drop the `Adapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterRequestActionMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterRequestVariable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterResponseTemplateMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdapterResponseVariable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardTemplateAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardTemplateVariable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataAdapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestVariableMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseVariableMapping` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `externalSystemConfigurationId` to the `EventMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalSystemResponseId` to the `EventMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalSystemConfigurationId` to the `ExternalIdentity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdapterRequest" DROP CONSTRAINT "AdapterRequest_adapterId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterRequestActionMapping" DROP CONSTRAINT "AdapterRequestActionMapping_adapterRequestId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterRequestActionMapping" DROP CONSTRAINT "AdapterRequestActionMapping_templateActionId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterRequestVariable" DROP CONSTRAINT "AdapterRequestVariable_requestId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterResponse" DROP CONSTRAINT "AdapterResponse_adapterId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterResponseTemplateMapping" DROP CONSTRAINT "AdapterResponseTemplateMapping_adapterResponseId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterResponseTemplateMapping" DROP CONSTRAINT "AdapterResponseTemplateMapping_templateId_fkey";

-- DropForeignKey
ALTER TABLE "AdapterResponseVariable" DROP CONSTRAINT "AdapterResponseVariable_adapterResponseId_fkey";

-- DropForeignKey
ALTER TABLE "CardTemplateAction" DROP CONSTRAINT "CardTemplateAction_templateId_fkey";

-- DropForeignKey
ALTER TABLE "CardTemplateVariable" DROP CONSTRAINT "CardTemplateVariable_templateId_fkey";

-- DropForeignKey
ALTER TABLE "DataAdapter" DROP CONSTRAINT "DataAdapter_adapterId_fkey";

-- DropForeignKey
ALTER TABLE "DataAdapter" DROP CONSTRAINT "DataAdapter_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "EventMapping" DROP CONSTRAINT "EventMapping_adapterResponseId_fkey";

-- DropForeignKey
ALTER TABLE "EventMapping" DROP CONSTRAINT "EventMapping_dataAdapterId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalIdentity" DROP CONSTRAINT "ExternalIdentity_dataAdapterId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalIdentityToken" DROP CONSTRAINT "ExternalIdentityToken_dataAdapterId_fkey";

-- DropForeignKey
ALTER TABLE "RequestVariableMapping" DROP CONSTRAINT "RequestVariableMapping_mappingId_fkey";

-- DropForeignKey
ALTER TABLE "RequestVariableMapping" DROP CONSTRAINT "RequestVariableMapping_requestVariableId_fkey";

-- DropForeignKey
ALTER TABLE "RequestVariableMapping" DROP CONSTRAINT "RequestVariableMapping_responseVariableId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVariableMapping" DROP CONSTRAINT "ResponseVariableMapping_adapterVariableId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVariableMapping" DROP CONSTRAINT "ResponseVariableMapping_mappingId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVariableMapping" DROP CONSTRAINT "ResponseVariableMapping_templateVariableId_fkey";

-- DropIndex
DROP INDEX "ExternalIdentityToken_dataAdapterId_key";

-- AlterTable
ALTER TABLE "EventMapping" DROP COLUMN "adapterResponseId",
DROP COLUMN "dataAdapterId",
ADD COLUMN     "externalSystemConfigurationId" TEXT NOT NULL,
ADD COLUMN     "externalSystemResponseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "dataAdapterId",
ADD COLUMN     "externalSystemConfigurationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExternalIdentityToken" DROP COLUMN "dataAdapterId";

-- DropTable
DROP TABLE "Adapter";

-- DropTable
DROP TABLE "AdapterRequest";

-- DropTable
DROP TABLE "AdapterRequestActionMapping";

-- DropTable
DROP TABLE "AdapterRequestVariable";

-- DropTable
DROP TABLE "AdapterResponse";

-- DropTable
DROP TABLE "AdapterResponseTemplateMapping";

-- DropTable
DROP TABLE "AdapterResponseVariable";

-- DropTable
DROP TABLE "CardTemplate";

-- DropTable
DROP TABLE "CardTemplateAction";

-- DropTable
DROP TABLE "CardTemplateVariable";

-- DropTable
DROP TABLE "DataAdapter";

-- DropTable
DROP TABLE "RequestVariableMapping";

-- DropTable
DROP TABLE "ResponseVariableMapping";

-- CreateTable
CREATE TABLE "ExternalSystem" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(4096),
    "minimumVersion" VARCHAR(24) NOT NULL,

    CONSTRAINT "ExternalSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemConfiguration" (
    "id" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "requestsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "domain" VARCHAR(128) NOT NULL,
    "setupTimestamp" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "instituteId" TEXT NOT NULL,
    "externalSystemId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemResponse" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "externalSystemId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemResponseVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "externalSystemResponseId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemResponseVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemRequest" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "externalSystemId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemRequestVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "externalSystemRequestId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemRequestVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemResponseTranslationMapping" (
    "id" TEXT NOT NULL,
    "externalSystemResponseVariableId" TEXT NOT NULL,
    "responseVariableId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemResponseTranslationMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalSystemRequestTranslationMapping" (
    "id" TEXT NOT NULL,
    "externalSystemRequestVariableId" TEXT NOT NULL,
    "requestVariableId" TEXT NOT NULL,

    CONSTRAINT "ExternalSystemRequestTranslationMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "responseId" TEXT NOT NULL,

    CONSTRAINT "ResponseVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "RequestVariable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalSystemResponseTranslationMapping_externalSystemResp_key" ON "ExternalSystemResponseTranslationMapping"("externalSystemResponseVariableId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalSystemResponseTranslationMapping_responseVariableId_key" ON "ExternalSystemResponseTranslationMapping"("responseVariableId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalSystemRequestTranslationMapping_externalSystemReque_key" ON "ExternalSystemRequestTranslationMapping"("externalSystemRequestVariableId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalSystemRequestTranslationMapping_requestVariableId_key" ON "ExternalSystemRequestTranslationMapping"("requestVariableId");

-- AddForeignKey
ALTER TABLE "EventMapping" ADD CONSTRAINT "EventMapping_externalSystemConfigurationId_fkey" FOREIGN KEY ("externalSystemConfigurationId") REFERENCES "ExternalSystemConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMapping" ADD CONSTRAINT "EventMapping_externalSystemResponseId_fkey" FOREIGN KEY ("externalSystemResponseId") REFERENCES "ExternalSystemResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentity" ADD CONSTRAINT "ExternalIdentity_externalSystemConfigurationId_fkey" FOREIGN KEY ("externalSystemConfigurationId") REFERENCES "ExternalSystemConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemConfiguration" ADD CONSTRAINT "ExternalSystemConfiguration_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemConfiguration" ADD CONSTRAINT "ExternalSystemConfiguration_externalSystemId_fkey" FOREIGN KEY ("externalSystemId") REFERENCES "ExternalSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemResponse" ADD CONSTRAINT "ExternalSystemResponse_externalSystemId_fkey" FOREIGN KEY ("externalSystemId") REFERENCES "ExternalSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemResponseVariable" ADD CONSTRAINT "ExternalSystemResponseVariable_externalSystemResponseId_fkey" FOREIGN KEY ("externalSystemResponseId") REFERENCES "ExternalSystemResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemRequest" ADD CONSTRAINT "ExternalSystemRequest_externalSystemId_fkey" FOREIGN KEY ("externalSystemId") REFERENCES "ExternalSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemRequestVariable" ADD CONSTRAINT "ExternalSystemRequestVariable_externalSystemRequestId_fkey" FOREIGN KEY ("externalSystemRequestId") REFERENCES "ExternalSystemRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemResponseTranslationMapping" ADD CONSTRAINT "ExternalSystemResponseTranslationMapping_externalSystemRes_fkey" FOREIGN KEY ("externalSystemResponseVariableId") REFERENCES "ExternalSystemResponseVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemResponseTranslationMapping" ADD CONSTRAINT "ExternalSystemResponseTranslationMapping_responseVariableI_fkey" FOREIGN KEY ("responseVariableId") REFERENCES "ResponseVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemRequestTranslationMapping" ADD CONSTRAINT "ExternalSystemRequestTranslationMapping_externalSystemRequ_fkey" FOREIGN KEY ("externalSystemRequestVariableId") REFERENCES "ExternalSystemRequestVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalSystemRequestTranslationMapping" ADD CONSTRAINT "ExternalSystemRequestTranslationMapping_requestVariableId_fkey" FOREIGN KEY ("requestVariableId") REFERENCES "RequestVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVariable" ADD CONSTRAINT "ResponseVariable_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestVariable" ADD CONSTRAINT "RequestVariable_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
