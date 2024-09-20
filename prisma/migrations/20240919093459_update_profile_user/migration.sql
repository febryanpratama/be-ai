/*
  Warnings:

  - You are about to drop the column `mood` on the `profile_users` table. All the data in the column will be lost.
  - Added the required column `gender` to the `profile_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `profile_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile_users" DROP COLUMN "mood",
ADD COLUMN     "foto" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "username" TEXT;
