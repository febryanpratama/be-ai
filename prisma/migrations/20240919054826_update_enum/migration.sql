/*
  Warnings:

  - The values [happy,sad,angry,fear,disgust,surprise,neutral,contempt,unknown,none] on the enum `typeMood` will be removed. If these variants are still used in the database, this will fail.
  - The `emoticon` column on the `mood_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "emoticonType" AS ENUM ('indifferent', 'confused', 'happy', 'sad', 'angry');

-- AlterEnum
BEGIN;
CREATE TYPE "typeMood_new" AS ENUM ('career', 'family', 'love', 'friends');
ALTER TABLE "mood_users" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "mood_users" ALTER COLUMN "type" TYPE "typeMood_new" USING ("type"::text::"typeMood_new");
ALTER TYPE "typeMood" RENAME TO "typeMood_old";
ALTER TYPE "typeMood_new" RENAME TO "typeMood";
DROP TYPE "typeMood_old";
COMMIT;

-- AlterTable
ALTER TABLE "mood_users" DROP COLUMN "emoticon",
ADD COLUMN     "emoticon" "emoticonType" NOT NULL DEFAULT 'indifferent',
ALTER COLUMN "type" DROP DEFAULT;
