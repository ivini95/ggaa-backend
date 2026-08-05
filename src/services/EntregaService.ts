import { prisma } from '../lib/prisma.js';

interface RegistrarEntregaDTO {
  atividadeId: number;
  alunoId: number;
  statusEntrega?: string;
  dataEntrega?: Date | string;
  nota?: number;
  feedback?: string;
  comentarios?: string;
}

interface AtualizarEntregaDTO {
  entregaId: number;
  statusEntrega?: string;
  dataEntrega?: Date | string | null;
  nota?: number;
  feedback?: string | null;
  comentarios?: string | null;
}

interface LancarNotasGrupoDTO {
  atividadeId: number;
  grupoId: number;
  nota: number;
  feedback?: string;
  statusEntrega?: string;
}

export class EntregaService {
  // 1. Inicializa registros de entrega pendentes para todos os alunos elegíveis da atividade
  async inicializarEntregasAtividade(atividadeId: number) {
    const atividade = await prisma.atividade.findUnique({
      where: { id: atividadeId },
      include: { grupo: true }
    });

    if (!atividade) {
      throw new Error('Atividade não encontrada.');
    }

    let alunosIdsParaCriar: number[] = [];

    // Se a atividade for vinculada a um grupo específico
    if (atividade.grupoId) {
      const integrantes = await prisma.grupoIntegrante.findMany({
        where: { grupoId: atividade.grupoId, ativo: true },
        select: { alunoId: true }
      });
      alunosIdsParaCriar = integrantes.map((i) => i.alunoId);
    } else {
      // Se for para a turma inteira
      const alunosTurma = await prisma.turmaAluno.findMany({
        where: { turmaId: atividade.turmaId, ativo: true },
        select: { alunoId: true }
      });
      alunosIdsParaCriar = alunosTurma.map((a) => a.alunoId);
    }

    if (alunosIdsParaCriar.length === 0) {
      throw new Error('Nenhum aluno ativo encontrado para esta atividade.');
    }

    // Busca entregas que já existem para não duplicar
    const entregasExistentes = await prisma.entrega.findMany({
      where: {
        atividadeId,
        alunoId: { in: alunosIdsParaCriar }
      },
      select: { alunoId: true }
    });

    const alunosExistentesSet = new Set(entregasExistentes.map((e) => e.alunoId));
    const novosAlunosIds = alunosIdsParaCriar.filter((id) => !alunosExistentesSet.has(id));

    if (novosAlunosIds.length === 0) {
      return { message: 'Todas as entregas para os alunos elegíveis já foram inicializadas.' };
    }

    await prisma.entrega.createMany({
      data: novosAlunosIds.map((alunoId) => ({
        atividadeId,
        alunoId,
        statusEntrega: 'PENDENTE',
        nota: 0
      }))
    });

    return { message: `${novosAlunosIds.length} entregas inicializadas com sucesso como PENDENTE.` };
  }

  // 2. Registrar ou atualizar entrega individual de um aluno
  async registrarOuAtualizar(dados: RegistrarEntregaDTO) {
    const atividade = await prisma.atividade.findUnique({
      where: { id: dados.atividadeId }
    });

    if (!atividade) {
      throw new Error('Atividade não encontrada.');
    }

    const aluno = await prisma.aluno.findUnique({
        where: { id: dados.alunoId}
    })

    if (!aluno) {
        throw new Error(`Aluno não foi encontrado.`);
    }

    // Valida se a nota não excede o valor máximo da atividade
    if (dados.nota !== undefined && dados.nota > Number(atividade.valorMaximo)) {
      throw new Error(`A nota (${dados.nota}) não pode ser maior que o valor máximo da atividade (${atividade.valorMaximo}).`);
    }

    const dataEntregaParsed = dados.dataEntrega ? new Date(dados.dataEntrega) : new Date();

    // Busca se já existe registro de entrega desse aluno nessa atividade
    const entregaExistente = await prisma.entrega.findFirst({
      where: {
        atividadeId: dados.atividadeId,
        alunoId: dados.alunoId
      }
    });

    if (entregaExistente) {
      return await prisma.entrega.update({
        where: { id: entregaExistente.id },
        data: {
          statusEntrega: dados.statusEntrega ?? entregaExistente.statusEntrega,
          dataEntrega: dataEntregaParsed,
          nota: dados.nota !== undefined ? dados.nota : entregaExistente.nota,
          feedback: dados.feedback !== undefined ? dados.feedback : entregaExistente.feedback,
          comentarios: dados.comentarios !== undefined ? dados.comentarios : entregaExistente.comentarios
        },
        include: { aluno: true, atividade: true }
      });
    }

    return await prisma.entrega.create({
      data: {
        atividadeId: dados.atividadeId,
        alunoId: dados.alunoId,
        statusEntrega: dados.statusEntrega ?? 'ENTREGUE',
        dataEntrega: dataEntregaParsed,
        nota: dados.nota ?? 0,
        feedback: dados.feedback,
        comentarios: dados.comentarios
      },
      include: { aluno: true, atividade: true }
    });
  }

  // 3. Lançar nota/feedback em lote para todos os alunos de um grupo
  async lancarNotaGrupo(dados: LancarNotasGrupoDTO) {
  const atividade = await prisma.atividade.findUnique({
    where: { id: dados.atividadeId }
  });

  if (!atividade) {
    throw new Error('Atividade não encontrada.');
  }

  if (dados.nota > Number(atividade.valorMaximo)) {
    throw new Error(`A nota (${dados.nota}) excede o valor máximo da atividade (${atividade.valorMaximo}).`);
  }

  // Busca todos os integrantes ativos do grupo
  const integrantes = await prisma.grupoIntegrante.findMany({
    where: { grupoId: dados.grupoId, ativo: true },
    select: { alunoId: true }
  });

  if (integrantes.length === 0) {
    throw new Error('Nenhum integrante ativo encontrado neste grupo.');
  }

  const agora = new Date();

  // Executa todas as atualizações/criações dentro de UMA ÚNICA transação interativa
  await prisma.$transaction(async (tx) => {
    for (const { alunoId } of integrantes) {
      const existente = await tx.entrega.findFirst({
        where: { atividadeId: dados.atividadeId, alunoId }
      });

      if (existente) {
        await tx.entrega.update({
          where: { id: existente.id },
          data: {
            statusEntrega: dados.statusEntrega ?? 'AVALIADO',
            dataEntrega: agora,
            nota: dados.nota,
            feedback: dados.feedback
          }
        });
      } else {
        await tx.entrega.create({
          data: {
            atividadeId: dados.atividadeId,
            alunoId,
            statusEntrega: dados.statusEntrega ?? 'AVALIADO',
            dataEntrega: agora,
            nota: dados.nota,
            feedback: dados.feedback
          }
        });
      }
    }
  });

  return { message: `Nota ${dados.nota} e feedback aplicados a todos os ${integrantes.length} integrantes do grupo.` };
}

  // 4. Listar todas as entregas de uma atividade
  async listarPorAtividade(atividadeId: number) {
    return await prisma.entrega.findMany({
      where: { atividadeId },
      include: {
        aluno: {
          select: { id: true, nome: true, observacoes: true }
        }
      },
      orderBy: { aluno: { nome: 'asc' } }
    });
  }

  // 5. Buscar entrega específica por ID
  async buscarPorId(entregaId: number) {
    const entrega = await prisma.entrega.findUnique({
      where: { id: entregaId },
      include: {
        aluno: true,
        atividade: true
      }
    });

    if (!entrega) {
      throw new Error('Entrega não encontrada.');
    }

    return entrega;
  }

  // 6. Atualizar entrega por ID
  async atualizar({ entregaId, ...dados }: AtualizarEntregaDTO) {
    const entregaAtual = await this.buscarPorId(entregaId);

    if (dados.nota !== undefined && dados.nota > Number(entregaAtual.atividade.valorMaximo)) {
      throw new Error(`A nota excede o valor máximo da atividade (${entregaAtual.atividade.valorMaximo}).`);
    }

    let dataEntregaParsed: Date | null | undefined;
    if (dados.dataEntrega !== undefined) {
      dataEntregaParsed = dados.dataEntrega ? new Date(dados.dataEntrega) : null;
    }

    return await prisma.entrega.update({
      where: { id: entregaId },
      data: {
        ...(dados.statusEntrega !== undefined && { statusEntrega: dados.statusEntrega }),
        ...(dataEntregaParsed !== undefined && { dataEntrega: dataEntregaParsed }),
        ...(dados.nota !== undefined && { nota: dados.nota }),
        ...(dados.feedback !== undefined && { feedback: dados.feedback }),
        ...(dados.comentarios !== undefined && { comentarios: dados.comentarios })
      },
      include: { aluno: true }
    });
  }

  // 7. Deletar entrega
  async deletar(entregaId: number) {
    await this.buscarPorId(entregaId);

    await prisma.entrega.delete({
      where: { id: entregaId }
    });

    return { message: 'Registro de entrega deletado com sucesso.' };
  }
}