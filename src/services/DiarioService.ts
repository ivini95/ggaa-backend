import { prisma } from '../lib/prisma.js';
import { CriarDiarioDTO, AtualizarDiarioDTO } from '../schemas/diario.schema.js';

export class DiarioService {
  async registrarAula(dados: CriarDiarioDTO) {
    const turmaExiste = await prisma.turma.findUnique({
      where: { id: dados.turmaId }
    });

    if (!turmaExiste) {
      throw new Error('Turma não encontrada.');
    }

    return prisma.diarioClasse.create({
      data: {
        turmaId: dados.turmaId,
        data: new Date(dados.data),
        quantidadeAulas: dados.quantidadeAulas,
        conteudoMinistrado: dados.conteudoMinistrado,
        objetivos: dados.objetivos,
        metodologia: dados.metodologia,
        recursos: dados.recursos,
        atividadeRealizada: dados.atividadeRealizada,
        ocorrencias: dados.ocorrencias,
        adaptacoesRealizadas: dados.adaptacoesRealizadas,
        observacoesGerais: dados.observacoesGerais
      }
    });
  }

  async listarPorTurma(turmaId: number) {
    return prisma.diarioClasse.findMany({
      where: { turmaId },
      orderBy: { data: 'desc' }
    });
  }

  async atualizarAula(id: number, dados: AtualizarDiarioDTO) {
    const registroExiste = await prisma.diarioClasse.findUnique({
      where: { id }
    });

    if (!registroExiste) {
      throw new Error('Registro do diário não encontrado.');
    }

    return prisma.diarioClasse.update({
      where: { id },
      data: {
        ...dados,
        ...(dados.data && { data: new Date(dados.data) })
      }
    });
  }

  async deletarAula(id: number) {
    const registroExiste = await prisma.diarioClasse.findUnique({
      where: { id }
    });

    if (!registroExiste) {
      throw new Error('Registro do diário não encontrado.');
    }

    await prisma.diarioClasse.delete({
      where: { id }
    });

    return { message: 'Lançamento do diário removido com sucesso.' };
  }
}