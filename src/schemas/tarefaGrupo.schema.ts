import { z } from 'zod';

export const StatusTarefaEnum = z.enum(['NAO_INICIADA', 'EM_ANDAMENTO', 'CONCLUIDA'], {
  message: 'O status deve ser: NAO_INICIADA, EM_ANDAMENTO ou CONCLUIDA.'
});

export const criarTarefaGrupoSchema = z.object({
  alunoId: z.number({ message: 'O ID do aluno deve ser um número.' }).optional().nullable(),
  titulo: z.string({ message: 'O título é obrigatório.' }).min(3, 'O título deve ter no mínimo 3 caracteres.'),
  prazo: z.string().optional().nullable(),
  status: StatusTarefaEnum.default('NAO_INICIADA')
});

export const atualizarTarefaGrupoSchema = z.object({
  alunoId: z.number().optional().nullable(),
  titulo: z.string().min(3, 'O título deve ter no mínimo 3 caracteres.').optional(),
  prazo: z.string().optional().nullable(),
  status: StatusTarefaEnum.optional()
});

export type CriarTarefaGrupoDTO = z.infer<typeof criarTarefaGrupoSchema>;
export type AtualizarTarefaGrupoDTO = z.infer<typeof atualizarTarefaGrupoSchema>;