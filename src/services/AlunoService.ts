import { prisma } from '../lib/prisma.js';

interface CriarAlunoDTO {
  nome: string;
  observacoes?: string;
  turmaId: number; 
}

interface AtualizarAlunoDTO {
  alunoId: number;
  nome?: string;
  observacoes?: string;
}

export class AlunoService {
  // 1. Criar Aluno (AGORA OBRIGA A TER UMA TURMA)
  async criar(dados: CriarAlunoDTO) {
    const turmaExiste = await prisma.turma.findUnique({
      where: { id: dados.turmaId }
    });

    if (!turmaExiste) {
      throw new Error('A turma informada não existe.');
    }

    const aluno = await prisma.aluno.create({
      data: {
        nome: dados.nome,
        observacoes: dados.observacoes,
        turmaAlunos: {
          create: {
            turmaId: dados.turmaId,
            ativo: true
          }
        }
      },
      include: {
        turmaAlunos: true
      }
    });

    return aluno;
  }

  async trocarTurma(alunoId: number, turmaOrigemId: number, turmaDestinoId: number) {
    // 1. Valida se a turma de origem e a turma de destino são diferentes
    if (turmaOrigemId === turmaDestinoId) {
      throw new Error('A turma de origem e a turma de destino devem ser diferentes.');
    }

    // 2. Valida existência do aluno
    await this.buscarPorId(alunoId);

    // 3. Valida existência da turma de destino
    const turmaDestino = await prisma.turma.findUnique({ where: { id: turmaDestinoId } });
    if (!turmaDestino) {
      throw new Error('A turma de destino informada não existe.');
    }

    // 4. Valida se o aluno REALMENTE pertence à turma de origem informada
    const vinculoOrigem = await prisma.turmaAluno.findUnique({
      where: {
        turmaId_alunoId: {
          turmaId: turmaOrigemId,
          alunoId
        }
      }
    });

    if (!vinculoOrigem) {
      throw new Error('O aluno não está matriculado na turma de origem informada.');
    }

    // 5. Executa a transferência em transação segura
    return await prisma.$transaction(async (tx) => {
      // a) Deleta o vínculo com a turma de origem
      await tx.turmaAluno.delete({
        where: {
          turmaId_alunoId: {
            turmaId: turmaOrigemId,
            alunoId
          }
        }
      });

      // b) Se já existir um histórico/vínculo antigo na turma de destino, atualiza; senão, cria
      const vinculoDestinoExistente = await tx.turmaAluno.findUnique({
        where: {
          turmaId_alunoId: {
            turmaId: turmaDestinoId,
            alunoId
          }
        }
      });

      if (vinculoDestinoExistente) {
        return await tx.turmaAluno.update({
          where: {
            turmaId_alunoId: {
              turmaId: turmaDestinoId,
              alunoId
            }
          },
          data: { ativo: true }
        });
      }

      return await tx.turmaAluno.create({
        data: {
          alunoId,
          turmaId: turmaDestinoId,
          ativo: true
        }
      });
    });
  }

  // 2. Listar Todos os Alunos
  async listar() {
    return await prisma.aluno.findMany({
      orderBy: { nome: 'asc' }
    });
  }

  // 3. Listar Alunos por Turma (por padrão traz apenas os ativos na turma)
  // 3. Listar Alunos por Turma (traz todos por padrão, a menos que especificado)
  async listarPorTurma(turmaId: number, apenasAtivos?: boolean) {
    const whereCondition: any = { turmaId };

    // Só aplica o filtro se 'apenasAtivos' for explicitamente true
    if (apenasAtivos === true) {
      whereCondition.ativo = true;
    }

    const turmaAlunos = await prisma.turmaAluno.findMany({
      where: whereCondition,
      include: {
        aluno: true
      },
      orderBy: {
        aluno: { nome: 'asc' }
      }
    });

    return turmaAlunos.map((ta) => ({
      ...ta.aluno,
      ativoNaTurma: ta.ativo
    }));
  }
  // 4. Buscar Aluno por ID
  async buscarPorId(alunoId: number) {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: {
        turmaAlunos: {
          include: {
            turma: true
          }
        }
      }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado.');
    }

    return aluno;
  }

  // 5. Vincular Aluno Existente a uma Turma
async vincularATurma(alunoId: number, turmaId: number) {
  // 1. Valida se o aluno existe
  await this.buscarPorId(alunoId);

  // 2. Valida se a turma existe no banco
  const turmaExiste = await prisma.turma.findUnique({
    where: { id: turmaId }
  });

  if (!turmaExiste) {
    throw new Error('A turma informada não existe.');
  }

  // 3. Checa vínculo existente
  const vinculoExistente = await prisma.turmaAluno.findUnique({
    where: {
      turmaId_alunoId: {
        turmaId,
        alunoId
      }
    }
  });

  if (vinculoExistente) {
    if (!vinculoExistente.ativo) {
      return await prisma.turmaAluno.update({
        where: {
          turmaId_alunoId: { turmaId, alunoId }
        },
        data: { ativo: true }
      });
    }

    throw new Error('Este aluno já está matriculado e ativo nesta turma.');
  }

  // 4. Cria o vínculo com segurança
  const vinculo = await prisma.turmaAluno.create({
    data: {
      alunoId,
      turmaId,
      ativo: true
    }
  });

  return vinculo;
}

  // 6. Alterar Status do Aluno na Turma (Ativar/Inativar)
  // 6. Alterar Status do Aluno na Turma (Ativar/Inativar)
async alterarStatusNaTurma(alunoId: number, turmaId: number, ativo: boolean) {
  // 1. Checa se o vínculo existe antes de tentar atualizar
  const vinculoExistente = await prisma.turmaAluno.findUnique({
    where: {
      turmaId_alunoId: {
        turmaId,
        alunoId
      }
    }
  });

  if (!vinculoExistente) {
    throw new Error('O aluno não possui matrícula vinculada a esta turma.');
  }

  // 2. Realiza a atualização com segurança
  const vinculo = await prisma.turmaAluno.update({
    where: {
      turmaId_alunoId: {
        turmaId,
        alunoId
      }
    },
    data: { ativo }
  });

  return vinculo;
}

  // 7. Desvincular Permanentemente Aluno de uma Turma
  // 7. Desvincular Permanentemente Aluno de uma Turma
async desvincularDeTurma(alunoId: number, turmaId: number) {
  // 1. Verifica se o vínculo entre o aluno e a turma existe no banco
  const vinculoExistente = await prisma.turmaAluno.findUnique({
    where: {
      turmaId_alunoId: {
        turmaId,
        alunoId
      }
    }
  });

  if (!vinculoExistente) {
    throw new Error('O aluno não possui vínculo cadastrado com esta turma.');
  }

  // 2. Remove o vínculo com segurança
  await prisma.turmaAluno.delete({
    where: {
      turmaId_alunoId: {
        turmaId,
        alunoId
      }
    }
  });

  return { message: 'Aluno removido da turma com sucesso.' };
}
  // 8. Atualizar Dados do Aluno
  async atualizar({ alunoId, ...dados }: AtualizarAlunoDTO) {
    await this.buscarPorId(alunoId);

    const alunoAtualizado = await prisma.aluno.update({
      where: { id: alunoId },
      data: dados
    });

    return alunoAtualizado;
  }

  // 9. Deletar Aluno
  async deletar(alunoId: number) {
    await this.buscarPorId(alunoId);

    await prisma.aluno.delete({
      where: { id: alunoId }
    });

    return { message: 'Aluno removido com sucesso.' };
  }
}