import { Request, Response } from 'express';
import { StatusTurma } from '@prisma/client';
import { TurmaService } from '../services/TurmaService.js';

const turmaService = new TurmaService();

export class TurmaController {
  // POST /api/turmas
  async criar(req: Request, res: Response) {
    try {
      const { nome, curso, disciplina, semestre, ano, turno } = req.body;
      const professorId = req.professorId!;

      if (!nome || !curso || !disciplina || !semestre || !ano || !turno) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      const turma = await turmaService.criar({
        nome,
        curso,
        disciplina,
        semestre: Number(semestre),
        ano: Number(ano),
        turno,
        professorId
      });

      return res.status(201).json(turma);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/turmas?status=ARQUIVADA (ou sem query param para listar ATIVA)
  async listar(req: Request, res: Response) {
    try {
      const professorId = req.professorId!;
      const { status } = req.query;

      let statusFiltro: StatusTurma | undefined;

      if (status && Object.values(StatusTurma).includes(status as StatusTurma)) {
        statusFiltro = status as StatusTurma;
      }

      const turmas = await turmaService.listarPorProfessor(professorId, statusFiltro);

      return res.json(turmas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/turmas/:id
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professorId = req.professorId!;

      const turma = await turmaService.buscarPorId(Number(id), professorId);

      return res.json(turma);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/turmas/:id
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, curso, disciplina, semestre, ano, turno } = req.body;
      const professorId = req.professorId!;

      const turma = await turmaService.atualizar({
        turmaId: Number(id),
        professorId,
        nome,
        curso,
        disciplina,
        semestre: semestre ? Number(semestre) : undefined,
        ano: ano ? Number(ano) : undefined,
        turno
      });

      return res.json(turma);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/turmas/:id/status
  async alterarStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'ATIVA' ou 'ARQUIVADA'
      const professorId = req.professorId!;

      if (!status || !Object.values(StatusTurma).includes(status)) {
        return res.status(400).json({ 
          error: 'Status inválido. Use: ATIVA ou ARQUIVADA.' 
        });
      }

      const turma = await turmaService.alterarStatus(Number(id), professorId, status as StatusTurma);

      return res.json({
        message: `Turma alterada para ${status} com sucesso!`,
        turma
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/turmas/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professorId = req.professorId!;

      const resultado = await turmaService.deletar(Number(id), professorId);

      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}