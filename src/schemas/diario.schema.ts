import { z } from 'zod';

export const criarDiarioSchema = z.object({
  turmaId: z.number({ message: 'O ID da turma é obrigatório.' }),
  data: z.string({ message: 'A data da aula é obrigatória.' }),
  quantidadeAulas: z.number().min(1, 'Informe pelo menos 1 aula.').default(1),
  conteudoMinistrado: z.string().min(3, 'O conteúdo ministrado é obrigatório.'),
  objetivos: z.string().optional(),
  metodologia: z.string().optional(),
  recursos: z.string().optional(),
  atividadeRealizada: z.string().optional(),
  ocorrencias: z.string().optional(),
  adaptacoesRealizadas: z.string().optional(),
  observacoesGerais: z.string().optional()
});

// Schema para atualização (campos do body tornam-se opcionais)
export const atualizarDiarioSchema = criarDiarioSchema.omit({ turmaId: true }).partial();

export type CriarDiarioDTO = z.infer<typeof criarDiarioSchema>;
export type AtualizarDiarioDTO = z.infer<typeof atualizarDiarioSchema>;