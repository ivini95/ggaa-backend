import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Mostra as queries SQL executadas no terminal durante o dev
});