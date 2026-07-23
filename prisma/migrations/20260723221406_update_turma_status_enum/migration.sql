/*
  Warnings:

  - The `status` column on the `turmas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusTurma" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDA', 'ARQUIVADA');

-- AlterTable
ALTER TABLE "turmas" DROP COLUMN "status",
ADD COLUMN     "status" "StatusTurma" NOT NULL DEFAULT 'EM_ANDAMENTO';
