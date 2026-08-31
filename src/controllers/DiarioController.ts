import { Request, Response } from 'express';
import { DiarioService } from '../services/DiarioService.js';

const diarioService = new DiarioService();

export class DiarioController {
  registrarAula = async (req: Request, res: Response) => {
    const registro = await diarioService.registrarAula(req.body);
    return res.status(201).json(registro);
  };

  listarPorTurma = async (req: Request, res: Response) => {
    const { turmaId } = req.params;
    const diarios = await diarioService.listarPorTurma(Number(turmaId));
    return res.json(diarios);
  };

  atualizarAula = async (req: Request, res: Response) => {
    const { id } = req.params;
    const registro = await diarioService.atualizarAula(Number(id), req.body);
    return res.json(registro);
  };

  deletarAula = async (req: Request, res: Response) => {
    const { id } = req.params;
    const resposta = await diarioService.deletarAula(Number(id));
    return res.json(resposta);
  };
}