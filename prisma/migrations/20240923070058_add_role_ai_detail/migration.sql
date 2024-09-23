-- CreateEnum
CREATE TYPE "roleAi" AS ENUM ('user', 'assistant');

-- AlterTable
ALTER TABLE "DetailConversation" ADD COLUMN     "roleAi" "roleAi" NOT NULL DEFAULT 'assistant';
