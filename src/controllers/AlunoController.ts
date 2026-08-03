import { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService.js';

const alunoService = new AlunoService();

export class AlunoController {
  // POST /api/alunos
  async criar(req: Request, res: Response) {
    try {
      const { nome, observacoes, turmaId } = req.body;

      // ✅ Validação rigorosa
      if (!nome || !turmaId) {
        return res.status(400).json({ error: 'O nome e a turmaId são obrigatórios.' });
      }

      const aluno = await alunoService.criar({
        nome,
        observacoes,
        turmaId: Number(turmaId)
      });

      return res.status(201).json(aluno);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async trocarTurma(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { turmaOrigemId, turmaDestinoId } = req.body;

      if (!turmaOrigemId || !turmaDestinoId) {
        return res.status(400).json({ error: 'As turmas de origem e destino são obrigatórias.' });
      }

      await alunoService.trocarTurma(Number(id), Number(turmaOrigemId), Number(turmaDestinoId));

      return res.json({ message: 'Aluno transferido de turma com sucesso!' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/alunos (ou /api/alunos?turmaId=1)
  async listar(req: Request, res: Response) {
    try {
      const { turmaId, apenasAtivos } = req.query;

      if (turmaId) {
        const somenteAtivos = apenasAtivos !== 'false';
        const alunos = await alunoService.listarPorTurma(Number(turmaId), somenteAtivos);
        return res.json(alunos);
      }

      const alunos = await alunoService.listar();
      return res.json(alunos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/alunos/:id
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const aluno = await alunoService.buscarPorId(Number(id));
      return res.json(aluno);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // POST /api/alunos/:id/vincular-turma
  async vincularATurma(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { turmaId } = req.body;

      if (!turmaId) {
        return res.status(400).json({ error: 'O id da turma é obrigatório.' });
      }

      const vinculo = await alunoService.vincularATurma(Number(id), Number(turmaId));
      return res.status(201).json({ message: 'Aluno vinculado à turma com sucesso!', vinculo });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/alunos/:id/turma/:turmaId/status
  async alterarStatusNaTurma(req: Request, res: Response) {
    try {
      const { id, turmaId } = req.params;
      const { ativo } = req.body;

      if (typeof ativo !== 'boolean') {
        return res.status(400).json({ error: 'O campo "ativo" deve ser um booleano (true ou false).' });
      }

      const vinculo = await alunoService.alterarStatusNaTurma(Number(id), Number(turmaId), ativo);
      return res.json({ message: `Status do aluno na turma alterado para ${ativo ? 'Ativo' : 'Inativo'}.`, vinculo });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/alunos/:id/desvincular-turma/:turmaId
  async desvincularDeTurma(req: Request, res: Response) {
    try {
      const { id, turmaId } = req.params;
      const resultado = await alunoService.desvincularDeTurma(Number(id), Number(turmaId));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/alunos/:id
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, observacoes } = req.body;

      const aluno = await alunoService.atualizar({
        alunoId: Number(id),
        nome,
        observacoes
      });

      return res.json(aluno);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/alunos/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await alunoService.deletar(Number(id));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}