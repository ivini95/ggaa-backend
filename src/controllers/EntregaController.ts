import { Request, Response } from 'express';
import { EntregaService } from '../services/EntregaService';

const entregaService = new EntregaService();

export class EntregaController {
  // POST /api/entregas/inicializar/atividade/:atividadeId
  async inicializarEntregasAtividade(req: Request, res: Response) {
    try {
      const { atividadeId } = req.params;
      const resultado = await entregaService.inicializarEntregasAtividade(Number(atividadeId));
      return res.status(201).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // POST /api/entregas
  async registrarOuAtualizar(req: Request, res: Response) {
    try {
      const { atividadeId, alunoId, statusEntrega, dataEntrega, nota, feedback, comentarios } = req.body;

      if (!atividadeId || !alunoId) {
        return res.status(400).json({ error: 'Os campos "atividadeId" e "alunoId" são obrigatórios.' });
      }

      const entrega = await entregaService.registrarOuAtualizar({
        atividadeId: Number(atividadeId),
        alunoId: Number(alunoId),
        statusEntrega,
        dataEntrega,
        nota: nota !== undefined ? Number(nota) : undefined,
        feedback,
        comentarios
      });

      return res.status(200).json(entrega);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // POST /api/entregas/grupo
  async lancarNotaGrupo(req: Request, res: Response) {
    try {
      const { atividadeId, grupoId, nota, feedback, statusEntrega } = req.body;

      if (!atividadeId || !grupoId || nota === undefined) {
        return res.status(400).json({ error: 'Os campos "atividadeId", "grupoId" e "nota" são obrigatórios.' });
      }

      const resultado = await entregaService.lancarNotaGrupo({
        atividadeId: Number(atividadeId),
        grupoId: Number(grupoId),
        nota: Number(nota),
        feedback,
        statusEntrega
      });

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /api/entregas/atividade/:atividadeId
  async listarPorAtividade(req: Request, res: Response) {
    try {
      const { atividadeId } = req.params;
      const entregas = await entregaService.listarPorAtividade(Number(atividadeId));
      return res.json(entregas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/entregas/:id
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entrega = await entregaService.buscarPorId(Number(id));
      return res.json(entrega);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/entregas/:id
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statusEntrega, dataEntrega, nota, feedback, comentarios } = req.body;

      const entrega = await entregaService.atualizar({
        entregaId: Number(id),
        statusEntrega,
        dataEntrega,
        nota: nota !== undefined ? Number(nota) : undefined,
        feedback,
        comentarios
      });

      return res.json(entrega);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/entregas/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await entregaService.deletar(Number(id));
      return res.json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}