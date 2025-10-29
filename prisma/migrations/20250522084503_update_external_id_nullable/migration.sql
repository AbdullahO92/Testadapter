-- AlterTable
ALTER TABLE "ExternalIdentity" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "extId" DROP NOT NULL;
