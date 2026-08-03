import { Request, Response } from 'express';
import { AtividadeService } from '../services/AtividadeService.js';

const atividadeService = new AtividadeService();

export class AtividadeController {
  // POST /api/atividades
  async criar(req: Request, res: Response) {
    try {
      const {
        nome,
        descricao,
        tipo,
        dataEntrega,
        peso,
        valorMaximo,
        criteriosAvaliacao,
        turmaId,
        grupoId
      } = req.body;

      if (!nome || !tipo || !dataEntrega || peso === undefined || valorMaximo === undefined || !turmaId) {
        return res.status(400).json({
          error: 'Os campos "nome", "tipo", "dataEntrega", "peso", "valorMaximo" e "turmaId" são obrigatórios.'
        });
      }

      const atividade = await atividadeService.criar({
        nome,
        descricao,
        tipo,
        dataEntrega,
        peso: Number(peso),
        valorMaximo: Number(valorMaximo),
        criteriosAvaliacao,
        turmaId: Number(turmaId),
        grupoId: grupoId ? Number(grupoId) : undefined
      });

      return res.status(201).json(atividade);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/atividades/turma/:turmaId
  async listarPorTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      const atividades = await atividadeService.listarPorTurma(Number(turmaId));
      return res.json(atividades);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/atividades/:id
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const atividade = await atividadeService.buscarPorId(Number(id));
      return res.json(atividade);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/atividades/:id
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        nome,
        descricao,
        tipo,
        dataEntrega,
        peso,
        valorMaximo,
        criteriosAvaliacao,
        grupoId
      } = req.body;

      const atividade = await atividadeService.atualizar({
        atividadeId: Number(id),
        nome,
        descricao,
        tipo,
        dataEntrega,
        peso: peso !== undefined ? Number(peso) : undefined,
        valorMaximo: valorMaximo !== undefined ? Number(valorMaximo) : undefined,
        criteriosAvaliacao,
        grupoId: grupoId !== undefined ? (grupoId === null ? null : Number(grupoId)) : undefined
      });

      return res.json(atividade);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/atividades/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await atividadeService.deletar(Number(id));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}