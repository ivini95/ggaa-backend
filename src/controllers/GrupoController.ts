import { Request, Response } from 'express';
import { GrupoService } from '../services/GrupoService.js';

const grupoService = new GrupoService();

export class GrupoController {
  // POST /api/grupos
  async criar(req: Request, res: Response) {
    try {
      const { nome, turmaId, alunoIds } = req.body;

      if (!nome || !turmaId) {
        return res.status(400).json({ error: 'Os campos "nome" e "turmaId" são obrigatórios.' });
      }

      const grupo = await grupoService.criar({
        nome,
        turmaId: Number(turmaId),
        alunoIds: Array.isArray(alunoIds) ? alunoIds.map(Number) : undefined
      });

      return res.status(201).json(grupo);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/grupos/turma/:turmaId
  async listarPorTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      const grupos = await grupoService.listarPorTurma(Number(turmaId));
      return res.json(grupos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/grupos/:id
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const grupo = await grupoService.buscarPorId(Number(id));
      return res.json(grupo);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // POST /api/grupos/:id/integrantes
  async adicionarIntegrante(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { alunoId } = req.body;

      if (!alunoId) {
        return res.status(400).json({ error: 'O campo "alunoId" é obrigatório.' });
      }

      const integrante = await grupoService.adicionarIntegrante(Number(id), Number(alunoId));
      return res.status(201).json({ message: 'Aluno adicionado ao grupo com sucesso!', integrante });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/grupos/:id/integrantes/:alunoId
  async removerIntegrante(req: Request, res: Response) {
    try {
      const { id, alunoId } = req.params;
      const resultado = await grupoService.removerIntegrante(Number(id), Number(alunoId));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PUT /api/grupos/:id
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
      }

      const grupo = await grupoService.atualizar({
        grupoId: Number(id),
        nome
      });

      return res.json(grupo);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/grupos/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await grupoService.deletar(Number(id));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}