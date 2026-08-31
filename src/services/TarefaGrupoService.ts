import { prisma } from '../lib/prisma.js';
import { CriarTarefaGrupoDTO, AtualizarTarefaGrupoDTO } from '../schemas/tarefaGrupo.schema.js';

export class TarefaGrupoService {
  async criar(grupoId: number, dados: CriarTarefaGrupoDTO) {
    const grupoExiste = await prisma.grupo.findUnique({
      where: { id: grupoId }
    });

    if (!grupoExiste) {
      throw new Error('Grupo não encontrado.');
    }

    if (dados.alunoId) {
      const eIntegrante = await prisma.grupoIntegrante.findUnique({
        where: {
          grupoId_alunoId: {
            grupoId,
            alunoId: dados.alunoId
          }
        }
      });

      if (!eIntegrante) {
        throw new Error('O aluno informado não é integrante deste grupo.');
      }
    }

    const prazoParsed = dados.prazo ? new Date(dados.prazo) : null;
    if (dados.prazo && isNaN(prazoParsed!.getTime())) {
      throw new Error('Data de prazo inválida.');
    }

    return await prisma.tarefaGrupo.create({
      data: {
        grupoId,
        alunoId: dados.alunoId ?? null,
        titulo: dados.titulo,
        prazo: prazoParsed,
        status: dados.status ?? 'NAO_INICIADA'
      },
      include: {
        aluno: { select: { id: true, nome: true } }
      }
    });
  }

  async listarPorGrupo(grupoId: number) {
    const grupoExiste = await prisma.grupo.findUnique({
      where: { id: grupoId }
    });

    if (!grupoExiste) {
      throw new Error('Grupo não encontrado.');
    }

    return await prisma.tarefaGrupo.findMany({
      where: { grupoId },
      include: {
        aluno: { select: { id: true, nome: true } }
      },
      orderBy: { id: 'asc' }
    });
  }

  async atualizar(tarefaId: number, dados: AtualizarTarefaGrupoDTO) {
    const tarefa = await prisma.tarefaGrupo.findUnique({ where: { id: tarefaId } });

    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }

    if (dados.alunoId) {
      const eIntegrante = await prisma.grupoIntegrante.findUnique({
        where: {
          grupoId_alunoId: {
            grupoId: tarefa.grupoId,
            alunoId: dados.alunoId
          }
        }
      });

      if (!eIntegrante) {
        throw new Error('O aluno informado não é integrante deste grupo.');
      }
    }

    let prazoParsed: Date | null | undefined;
    if (dados.prazo !== undefined) {
      prazoParsed = dados.prazo ? new Date(dados.prazo) : null;
      if (dados.prazo && isNaN(prazoParsed!.getTime())) {
        throw new Error('Data de prazo inválida.');
      }
    }

    return await prisma.tarefaGrupo.update({
      where: { id: tarefaId },
      data: {
        ...(dados.titulo !== undefined && { titulo: dados.titulo }),
        ...(dados.status !== undefined && { status: dados.status }),
        ...(dados.alunoId !== undefined && { alunoId: dados.alunoId }),
        ...(prazoParsed !== undefined && { prazo: prazoParsed })
      },
      include: {
        aluno: { select: { id: true, nome: true } }
      }
    });
  }

  async deletar(tarefaId: number) {
    const tarefa = await prisma.tarefaGrupo.findUnique({ where: { id: tarefaId } });

    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }

    await prisma.tarefaGrupo.delete({ where: { id: tarefaId } });

    return { message: 'Tarefa deletada com sucesso.' };
  }
}