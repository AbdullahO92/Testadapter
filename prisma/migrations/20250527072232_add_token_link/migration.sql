-- AlterTable
ALTER TABLE "EventSubscription" ADD COLUMN     "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notificationHash" VARCHAR(128);
