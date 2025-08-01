/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ActionDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Debt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Debt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Debtor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `invoiceNumber` on table `Debt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Debt" ALTER COLUMN "invoiceNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Action_id_key" ON "Action"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionDetail_id_key" ON "ActionDetail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Debt_id_key" ON "Debt"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Debt_invoiceNumber_key" ON "Debt"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Debtor_id_key" ON "Debtor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
