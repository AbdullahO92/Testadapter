/*
  Warnings:

  - You are about to drop the column `environment` on the `ExternalIdentity` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `ExternalIdentity` table. All the data in the column will be lost.
  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adapterId` to the `ExternalIdentity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('OpenUrl');

-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_userPreferenceId_fkey";

-- AlterTable
ALTER TABLE "ExternalIdentity" DROP COLUMN "environment",
DROP COLUMN "version",
ADD COLUMN     "adapterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Integration";

-- CreateTable
CREATE TABLE "EventSubscription" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "eventMappingId" TEXT NOT NULL,

    CONSTRAINT "EventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMapping" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "summary" VARCHAR(1028) NOT NULL,
    "description" VARCHAR(1028),
    "isTrigger" BOOLEAN NOT NULL DEFAULT true,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isDefaultEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dataAdapterId" TEXT NOT NULL,

    CONSTRAINT "EventMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAdapter" (
    "id" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "requestsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "domain" VARCHAR(128) NOT NULL,
    "setupTimestamp" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataAdapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adapter" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(4096),
    "minimumVersion" VARCHAR(24) NOT NULL,

    CONSTRAINT "Adapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterResponse" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "adapterId" TEXT NOT NULL,

    CONSTRAINT "AdapterResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterResponseVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "adapterResponseId" TEXT NOT NULL,

    CONSTRAINT "AdapterResponseVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterResponseTemplateMapping" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "json" VARCHAR(32768) NOT NULL,
    "adapterResponseId" TEXT,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "AdapterResponseTemplateMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseVariableMapping" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "combine" BOOLEAN NOT NULL DEFAULT false,
    "adapterVariableId" TEXT,
    "mappingId" TEXT NOT NULL,
    "templateVariableId" TEXT NOT NULL,

    CONSTRAINT "ResponseVariableMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTemplate" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "json" VARCHAR(32768) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CardTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTemplateVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1028),
    "defaultValue" VARCHAR(4096) NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "CardTemplateVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTemplateAction" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "CardTemplateAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterRequestActionMapping" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "json" VARCHAR(32768) NOT NULL,
    "templateActionId" TEXT NOT NULL,
    "adapterRequestId" TEXT NOT NULL,

    CONSTRAINT "AdapterRequestActionMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestVariableMapping" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "combine" BOOLEAN NOT NULL DEFAULT false,
    "responseVariableId" TEXT,
    "mappingId" TEXT NOT NULL,
    "requestVariableId" TEXT NOT NULL,

    CONSTRAINT "RequestVariableMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterRequest" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "adapterId" TEXT NOT NULL,

    CONSTRAINT "AdapterRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdapterRequestVariable" (
    "id" TEXT NOT NULL,
    "internalName" VARCHAR(128) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "AdapterRequestVariable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventSubscription" ADD CONSTRAINT "EventSubscription_eventMappingId_fkey" FOREIGN KEY ("eventMappingId") REFERENCES "EventMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMapping" ADD CONSTRAINT "EventMapping_dataAdapterId_fkey" FOREIGN KEY ("dataAdapterId") REFERENCES "DataAdapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentity" ADD CONSTRAINT "ExternalIdentity_adapterId_fkey" FOREIGN KEY ("adapterId") REFERENCES "Adapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterResponse" ADD CONSTRAINT "AdapterResponse_adapterId_fkey" FOREIGN KEY ("adapterId") REFERENCES "Adapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterResponseVariable" ADD CONSTRAINT "AdapterResponseVariable_adapterResponseId_fkey" FOREIGN KEY ("adapterResponseId") REFERENCES "AdapterResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterResponseTemplateMapping" ADD CONSTRAINT "AdapterResponseTemplateMapping_adapterResponseId_fkey" FOREIGN KEY ("adapterResponseId") REFERENCES "AdapterResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterResponseTemplateMapping" ADD CONSTRAINT "AdapterResponseTemplateMapping_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CardTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVariableMapping" ADD CONSTRAINT "ResponseVariableMapping_adapterVariableId_fkey" FOREIGN KEY ("adapterVariableId") REFERENCES "AdapterResponseVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVariableMapping" ADD CONSTRAINT "ResponseVariableMapping_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "AdapterResponseTemplateMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVariableMapping" ADD CONSTRAINT "ResponseVariableMapping_templateVariableId_fkey" FOREIGN KEY ("templateVariableId") REFERENCES "CardTemplateVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTemplateVariable" ADD CONSTRAINT "CardTemplateVariable_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CardTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTemplateAction" ADD CONSTRAINT "CardTemplateAction_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CardTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterRequestActionMapping" ADD CONSTRAINT "AdapterRequestActionMapping_templateActionId_fkey" FOREIGN KEY ("templateActionId") REFERENCES "CardTemplateAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterRequestActionMapping" ADD CONSTRAINT "AdapterRequestActionMapping_adapterRequestId_fkey" FOREIGN KEY ("adapterRequestId") REFERENCES "AdapterRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestVariableMapping" ADD CONSTRAINT "RequestVariableMapping_responseVariableId_fkey" FOREIGN KEY ("responseVariableId") REFERENCES "AdapterResponseVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestVariableMapping" ADD CONSTRAINT "RequestVariableMapping_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "AdapterRequestActionMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestVariableMapping" ADD CONSTRAINT "RequestVariableMapping_requestVariableId_fkey" FOREIGN KEY ("requestVariableId") REFERENCES "AdapterRequestVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterRequest" ADD CONSTRAINT "AdapterRequest_adapterId_fkey" FOREIGN KEY ("adapterId") REFERENCES "Adapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdapterRequestVariable" ADD CONSTRAINT "AdapterRequestVariable_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AdapterRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
