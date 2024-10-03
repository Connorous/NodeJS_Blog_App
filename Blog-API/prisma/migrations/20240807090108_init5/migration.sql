/*
  Warnings:

  - You are about to drop the `BlogPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_blogpostId_fkey";

-- DropTable
DROP TABLE "BlogPost";

-- CreateTable
CREATE TABLE "Blogpost" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ownerId" INTEGER,
    "published" BOOLEAN NOT NULL,

    CONSTRAINT "Blogpost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blogpost" ADD CONSTRAINT "Blogpost_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogpostId_fkey" FOREIGN KEY ("blogpostId") REFERENCES "Blogpost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
