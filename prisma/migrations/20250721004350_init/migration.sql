/*
  Warnings:

  - You are about to drop the column `date` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `actionType` on the `ActionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `ActionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `ActionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ActionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `email2` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `vat` on the `Client` table. All the data in the column will be lost.
  - The `email` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phone` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `siret` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `amount` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Debt` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[internalRef]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `debtorId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ActionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ActionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalRef` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountHT` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountTTC` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debtorId` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DebtorType" AS ENUM ('PROFESSIONAL', 'PERSONAL');

-- CreateEnum
CREATE TYPE "DebtorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "ActionDetailType" AS ENUM ('EMAIL', 'CALL', 'SMS', 'LETTER', 'VISIT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_userId_fkey";

-- DropForeignKey
ALTER TABLE "ActionDetail" DROP CONSTRAINT "ActionDetail_folderId_fkey";

-- DropForeignKey
ALTER TABLE "ActionDetail" DROP CONSTRAINT "ActionDetail_userId_fkey";

-- DropForeignKey
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "date",
DROP COLUMN "folderId",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "debtorId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ActionDetail" DROP COLUMN "actionType",
DROP COLUMN "comment",
DROP COLUMN "folderId",
DROP COLUMN "userId",
ADD COLUMN     "note" VARCHAR(255),
ADD COLUMN     "type" "ActionDetailType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "email2",
DROP COLUMN "vat",
ADD COLUMN     "internalRef" VARCHAR(255) NOT NULL,
ADD COLUMN     "notes" TEXT[],
DROP COLUMN "email",
ADD COLUMN     "email" TEXT[],
DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[],
ALTER COLUMN "siret" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "amount",
DROP COLUMN "folderId",
DROP COLUMN "userId",
ADD COLUMN     "amountHT" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "amountOverdue" DECIMAL(10,2),
ADD COLUMN     "amountPaid" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "amountRemaining" DECIMAL(10,2),
ADD COLUMN     "amountTTC" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "debtorId" TEXT NOT NULL,
ADD COLUMN     "invoiceNumber" VARCHAR(255),
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "Debtor" (
    "id" TEXT NOT NULL,
    "reference" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT[],
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "country" TEXT,
    "siret" VARCHAR(255),
    "type" "DebtorType" NOT NULL DEFAULT 'PROFESSIONAL',
    "status" "DebtorStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Debtor_reference_key" ON "Debtor"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Client_internalRef_key" ON "Client"("internalRef");

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
