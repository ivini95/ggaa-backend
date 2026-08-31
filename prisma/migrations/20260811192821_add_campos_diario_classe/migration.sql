/*
  Warnings:

  - Added the required column `atualizado_em` to the `diario_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diario_classes" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantidade_aulas" INTEGER NOT NULL DEFAULT 1;
