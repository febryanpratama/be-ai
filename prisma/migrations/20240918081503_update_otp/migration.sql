/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id` on table `Otp` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `code` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Otp_code_key";

-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "id" SET NOT NULL,
DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Otp_id_key" ON "Otp"("id");
