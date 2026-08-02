import { prisma } from '../lib/prisma.js';

interface CriarGrupoDTO {
  nome: string;
  turmaId: number;
  alunoIds?: number[]; // Opcional: lista de IDs de alunos para adicionar de início
}

interface AtualizarGrupoDTO {
  grupoId: number;
  nome: string;
}

export class GrupoService {
  // 1. Criar Grupo (e opcionalmente adicionar integrantes iniciais)
  async criar(dados: CriarGrupoDTO) {
    // Valida se a turma existe
    const turmaExiste = await prisma.turma.findUnique({
      where: { id: dados.turmaId }
    });

    if (!turmaExiste) {
      throw new Error('A turma informada não existe.');
    }

    // Se foram passados alunos, valida se todos estão ativos na turma
    if (dados.alunoIds && dados.alunoIds.length > 0) {
      await this.validarAlunosNaTurma(dados.alunoIds, dados.turmaId);
    }

    const grupo = await prisma.grupo.create({
      data: {
        nome: dados.nome,
        turmaId: dados.turmaId,
        ...(dados.alunoIds && dados.alunoIds.length > 0 && {
          grupoIntegrantes: {
            createMany: {
              data: dados.alunoIds.map((alunoId) => ({ alunoId }))
            }
          }
        })
      },
      include: {
        grupoIntegrantes: {
          include: {
            aluno: true
          }
        }
      }
    });

    return grupo;
  }

  // 2. Listar Grupos por Turma
  async listarPorTurma(turmaId: number) {
    const grupos = await prisma.grupo.findMany({
      where: { turmaId },
      include: {
        grupoIntegrantes: {
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                observacoes: true
              }
            }
          }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return grupos;
  }

  // 3. Buscar Grupo por ID
  async buscarPorId(grupoId: number) {
    const grupo = await prisma.grupo.findUnique({
      where: { id: grupoId },
      include: {
        turma: true,
        grupoIntegrantes: {
          include: {
            aluno: true
          }
        }
      }
    });

    if (!grupo) {
      throw new Error('Grupo não encontrado.');
    }

    return grupo;
  }

  // 4. Adicionar Integrante ao Grupo
  async adicionarIntegrante(grupoId: number, alunoId: number) {
    const grupo = await this.buscarPorId(grupoId);

    // Valida se o aluno está ativo na turma do grupo
    await this.validarAlunosNaTurma([alunoId], grupo.turmaId);

    // Verifica se já faz parte do grupo
    const jaEIntegrante = await prisma.grupoIntegrante.findUnique({
      where: {
        grupoId_alunoId: {
          grupoId,
          alunoId
        }
      }
    });

    if (jaEIntegrante) {
      throw new Error('Este aluno já faz parte deste grupo.');
    }

    const integrante = await prisma.grupoIntegrante.create({
      data: {
        grupoId,
        alunoId
      },
      include: {
        aluno: true
      }
    });

    return integrante;
  }

  // 5. Remover Integrante do Grupo
  async removerIntegrante(grupoId: number, alunoId: number) {
    const vinculo = await prisma.grupoIntegrante.findUnique({
      where: {
        grupoId_alunoId: {
          grupoId,
          alunoId
        }
      }
    });

    if (!vinculo) {
      throw new Error('Este aluno não pertence a este grupo.');
    }

    await prisma.grupoIntegrante.delete({
      where: {
        grupoId_alunoId: {
          grupoId,
          alunoId
        }
      }
    });

    return { message: 'Aluno removido do grupo com sucesso.' };
  }

  // 6. Atualizar Nome do Grupo
  async atualizar({ grupoId, nome }: AtualizarGrupoDTO) {
    await this.buscarPorId(grupoId);

    const grupoAtualizado = await prisma.grupo.update({
      where: { id: grupoId },
      data: { nome }
    });

    return grupoAtualizado;
  }

  // 7. Deletar Grupo
  async deletar(grupoId: number) {
    await this.buscarPorId(grupoId);

    await prisma.grupo.delete({
      where: { id: grupoId }
    });

    return { message: 'Grupo deletado com sucesso.' };
  }

  // --- Função auxiliar de validação defensiva ---
  private async validarAlunosNaTurma(alunoIds: number[], turmaId: number) {
    const alunosNaTurma = await prisma.turmaAluno.findMany({
      where: {
        turmaId,
        alunoId: { in: alunoIds },
        ativo: true
      }
    });

    if (alunosNaTurma.length !== alunoIds.length) {
      throw new Error('Um ou mais alunos informados não pertencem ou estão inativos nesta turma.');
    }
  }
}