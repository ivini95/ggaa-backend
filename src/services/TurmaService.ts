import { StatusTurma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

interface CriarTurmaDTO {
  nome: string;
  curso: string;
  disciplina: string;
  semestre: number;
  ano: number;
  turno: string;
  professorId: number;
}

interface AtualizarTurmaDTO {
  turmaId: number;
  professorId: number;
  nome?: string;
  curso?: string;
  disciplina?: string;
  semestre?: number;
  ano?: number;
  turno?: string;
}

export class TurmaService {
  // 1. Criar Turma (Status inicial: ATIVA)
  async criar(dados: CriarTurmaDTO) {
    const turma = await prisma.turma.create({
      data: {
        ...dados,
        status: StatusTurma.ATIVA
      }
    });

    return turma;
  }

  // 2. Listar Turmas (Por padrão traz as ATIVAS. Se passar status, filtra por ele)
  async listarPorProfessor(professorId: number, status?: StatusTurma) {
    const turmas = await prisma.turma.findMany({
      where: {
        professorId,
        status: status || StatusTurma.ATIVA
      },
      include: {
        _count: {
          select: {
            turmaAlunos: true,
            grupos: true,
            atividades: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    return turmas;
  }

  // 3. Buscar Turma por ID
  async buscarPorId(turmaId: number, professorId: number) {
    const turma = await prisma.turma.findFirst({
      where: {
        id: turmaId,
        professorId
      },
      include: {
        turmaAlunos: {
          include: {
            aluno: true
          }
        },
        grupos: true,
        atividades: true,
        diariosClasse: true
      }
    });

    if (!turma) {
      throw new Error('Turma não encontrada ou você não tem permissão para acessá-la.');
    }

    return turma;
  }

  // 4. Atualizar Dados Gerais
  async atualizar({ turmaId, professorId, ...dados }: AtualizarTurmaDTO) {
    await this.buscarPorId(turmaId, professorId);

    const turmaAtualizada = await prisma.turma.update({
      where: { id: turmaId },
      data: dados
    });

    return turmaAtualizada;
  }

  // 5. Alternar Status (ATIVA <-> ARQUIVADA)
  async alterarStatus(turmaId: number, professorId: number, novoStatus: StatusTurma) {
    await this.buscarPorId(turmaId, professorId);

    const turmaAtualizada = await prisma.turma.update({
      where: { id: turmaId },
      data: { status: novoStatus }
    });

    return turmaAtualizada;
  }

  // 6. Deletar Turma
  async deletar(turmaId: number, professorId: number) {
    await this.buscarPorId(turmaId, professorId);

    await prisma.turma.delete({
      where: { id: turmaId }
    });

    return { message: 'Turma removida com sucesso.' };
  }
}