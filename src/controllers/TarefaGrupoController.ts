import { Request, Response } from 'express';
import { TarefaGrupoService } from '../services/TarefaGrupoService.js';

export class TarefaGrupoController {
  private tarefaGrupoService: TarefaGrupoService;

  constructor() {
    this.tarefaGrupoService = new TarefaGrupoService();
  }

  async criar(req: Request, res: Response) {
    try {
      const grupoId = Number(req.params.id);
      const tarefa = await this.tarefaGrupoService.criar(grupoId, req.body);
      return res.status(201).json(tarefa);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listarPorGrupo(req: Request, res: Response) {
    try {
      const grupoId = Number(req.params.id);
      const tarefas = await this.tarefaGrupoService.listarPorGrupo(grupoId);
      return res.status(200).json(tarefas);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const tarefaId = Number(req.params.tarefaId);
      const tarefa = await this.tarefaGrupoService.atualizar(tarefaId, req.body);
      return res.status(200).json(tarefa);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const tarefaId = Number(req.params.tarefaId);
      const resultado = await this.tarefaGrupoService.deletar(tarefaId);
      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}