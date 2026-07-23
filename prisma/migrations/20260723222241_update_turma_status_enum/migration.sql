/*
  Warnings:

  - The values [EM_ANDAMENTO,CONCLUIDA] on the enum `StatusTurma` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusTurma_new" AS ENUM ('ATIVA', 'ARQUIVADA');
ALTER TABLE "public"."turmas" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "turmas" ALTER COLUMN "status" TYPE "StatusTurma_new" USING ("status"::text::"StatusTurma_new");
ALTER TYPE "StatusTurma" RENAME TO "StatusTurma_old";
ALTER TYPE "StatusTurma_new" RENAME TO "StatusTurma";
DROP TYPE "public"."StatusTurma_old";
ALTER TABLE "turmas" ALTER COLUMN "status" SET DEFAULT 'ATIVA';
COMMIT;

-- AlterTable
ALTER TABLE "turmas" ALTER COLUMN "status" SET DEFAULT 'ATIVA';
