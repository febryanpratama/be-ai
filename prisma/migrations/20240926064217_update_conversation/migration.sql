-- CreateEnum
CREATE TYPE "sessionType" AS ENUM ('physical', 'mental_emotional', 'social', 'spiritual', 'financial');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "type" "sessionType" NOT NULL DEFAULT 'physical';
