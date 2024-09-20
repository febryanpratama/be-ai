-- CreateEnum
CREATE TYPE "typeMood" AS ENUM ('happy', 'sad', 'angry', 'fear', 'disgust', 'surprise', 'neutral', 'contempt', 'unknown', 'none');

-- CreateTable
CREATE TABLE "mood_users" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "emoticon" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "type" "typeMood" NOT NULL DEFAULT 'none',
    "responseAi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mood_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mood_users" ADD CONSTRAINT "mood_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
