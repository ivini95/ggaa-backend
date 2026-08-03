import { prisma } from '../lib/prisma.js';

interface CriarAtividadeDTO {
  nome: string;
  descricao?: string;
  tipo: string; // Ex: "INDIVIDUAL" ou "GRUPO"
  dataEntrega: Date | string;
  peso: number;
  valorMaximo: number;
  criteriosAvaliacao?: string;
  turmaId: number;
  grupoId?: number;
}

interface AtualizarAtividadeDTO {
  atividadeId: number;
  nome?: string;
  descricao?: string;
  tipo?: string;
  dataEntrega?: Date | string;
  peso?: number;
  valorMaximo?: number;
  criteriosAvaliacao?: string;
  grupoId?: number | null;
}

export class AtividadeService {
  // 1. Criar Atividade
  async criar(dados: CriarAtividadeDTO) {
    // Valida se a turma existe
    const turmaExiste = await prisma.turma.findUnique({
      where: { id: dados.turmaId }
    });

    if (!turmaExiste) {
      throw new Error('A turma informada não existe.');
    }

    // Se informou grupo, valida se ele existe
    if (dados.grupoId) {
      const grupoExiste = await prisma.grupo.findUnique({
        where: { id: dados.grupoId }
      });

      if (!grupoExiste) {
        throw new Error('O grupo informado não existe.');
      }
    }

    const dataEntregaParsed = new Date(dados.dataEntrega);
    if (isNaN(dataEntregaParsed.getTime())) {
      throw new Error('Data de entrega inválida.');
    }

    const atividade = await prisma.atividade.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        tipo: dados.tipo,
        dataEntrega: dataEntregaParsed,
        peso: dados.peso,
        valorMaximo: dados.valorMaximo,
        criteriosAvaliacao: dados.criteriosAvaliacao,
        turmaId: dados.turmaId,
        grupoId: dados.grupoId ?? null
      },
      include: {
        turma: {
          select: { id: true, nome: true }
        },
        grupo: {
          select: { id: true, nome: true }
        }
      }
    });

    return atividade;
  }

  // 2. Listar Atividades por Turma
  async listarPorTurma(turmaId: number) {
    const atividades = await prisma.atividade.findMany({
      where: { turmaId },
      orderBy: { dataEntrega: 'asc' },
      include: {
        grupo: {
          select: { id: true, nome: true }
        },
        _count: {
          select: { entregas: true }
        }
      }
    });

    return atividades;
  }

  // 3. Buscar Atividade por ID
  async buscarPorId(atividadeId: number) {
    const atividade = await prisma.atividade.findUnique({
      where: { id: atividadeId },
      include: {
        turma: true,
        grupo: true,
        entregas: true
      }
    });

    if (!atividade) {
      throw new Error('Atividade não encontrada.');
    }

    return atividade;
  }

  // 4. Atualizar Atividade
  async atualizar({ atividadeId, ...dados }: AtualizarAtividadeDTO) {
    await this.buscarPorId(atividadeId);

    let dataEntregaParsed: Date | undefined;
    if (dados.dataEntrega) {
      dataEntregaParsed = new Date(dados.dataEntrega);
      if (isNaN(dataEntregaParsed.getTime())) {
        throw new Error('Data de entrega inválida.');
      }
    }

    if (dados.grupoId) {
      const grupoExiste = await prisma.grupo.findUnique({
        where: { id: dados.grupoId }
      });

      if (!grupoExiste) {
        throw new Error('O grupo informado não existe.');
      }
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id: atividadeId },
      data: {
        ...(dados.nome !== undefined && { nome: dados.nome }),
        ...(dados.descricao !== undefined && { descricao: dados.descricao }),
        ...(dados.tipo !== undefined && { tipo: dados.tipo }),
        ...(dataEntregaParsed !== undefined && { dataEntrega: dataEntregaParsed }),
        ...(dados.peso !== undefined && { peso: dados.peso }),
        ...(dados.valorMaximo !== undefined && { valorMaximo: dados.valorMaximo }),
        ...(dados.criteriosAvaliacao !== undefined && { criteriosAvaliacao: dados.criteriosAvaliacao }),
        ...(dados.grupoId !== undefined && { grupoId: dados.grupoId })
      }
    });

    return atividadeAtualizada;
  }

  // 5. Deletar Atividade
  async deletar(atividadeId: number) {
    await this.buscarPorId(atividadeId);

    await prisma.atividade.delete({
      where: { id: atividadeId }
    });

    return { message: 'Atividade deletada com sucesso.' };
  }
}