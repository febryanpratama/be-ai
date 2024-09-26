-- CreateEnum
CREATE TYPE "sessionType" AS ENUM ('physical', 'mental_emotional', 'social', 'spiritual', 'financial');

-- CreateEnum
CREATE TYPE "typeDuration" AS ENUM ('month', 'year');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "type" "sessionType" NOT NULL DEFAULT 'physical',
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "total_people" TEXT NOT NULL,
    "type" "typeDuration" NOT NULL DEFAULT 'month',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
