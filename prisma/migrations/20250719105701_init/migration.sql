/*
  Warnings:

  - The `type` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `Debt` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[reference]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Made the column `folderId` on table `Debt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientId` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'USER', 'GUEST');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PROFESSIONAL', 'PERSONAL');

-- CreateEnum
CREATE TYPE "ActionState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DebtState" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- DropForeignKey
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_clientId_fkey";

-- DropIndex
DROP INDEX "Client_email_key";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "email2" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ClientType" NOT NULL DEFAULT 'PROFESSIONAL';

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "status",
ADD COLUMN     "state" "DebtState" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "folderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "ActionState" NOT NULL DEFAULT 'PENDING',
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionDetail" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionId" TEXT NOT NULL,
    "userId" TEXT,
    "folderId" TEXT,

    CONSTRAINT "ActionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_reference_key" ON "Folder"("reference");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionDetail" ADD CONSTRAINT "ActionDetail_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionDetail" ADD CONSTRAINT "ActionDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionDetail" ADD CONSTRAINT "ActionDetail_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
