/*
  Warnings:

  - Made the column `userId` on table `ActionDetail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `folderId` on table `ActionDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ActionDetail" DROP CONSTRAINT "ActionDetail_folderId_fkey";

-- DropForeignKey
ALTER TABLE "ActionDetail" DROP CONSTRAINT "ActionDetail_userId_fkey";

-- AlterTable
ALTER TABLE "ActionDetail" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "folderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ActionDetail" ADD CONSTRAINT "ActionDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionDetail" ADD CONSTRAINT "ActionDetail_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
