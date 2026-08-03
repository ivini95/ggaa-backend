import { z } from 'zod';

// Validador base para transformar string da URL em número inteiro positivo
const numericId = z
  .string()
  .regex(/^\d+$/, { message: 'Deve conter apenas números inteiros.' })
  .transform(Number);

// 1. Para rotas com apenas :id
export const idParamSchema = z.object({
  params: z.object({
    id: numericId,
  }),
});

// 2. Para rotas com apenas :turmaId
export const turmaIdParamSchema = z.object({
  params: z.object({
    turmaId: numericId,
  }),
});

// 3. Para rotas com :id e :turmaId (ex: /:id/turma/:turmaId/status)
export const idAndTurmaIdParamSchema = z.object({
  params: z.object({
    id: numericId,
    turmaId: numericId,
  }),
});

// 4. Para rotas com :id e :alunoId (ex: /:id/integrantes/:alunoId)
export const idAndAlunoIdParamSchema = z.object({
  params: z.object({
    id: numericId,
    alunoId: numericId,
  }),
});