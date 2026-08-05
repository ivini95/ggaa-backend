import { Request, Response, NextFunction } from 'express';

export const validateBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Exceção: Se for a rota de inicializar entregas, ignora a checagem de body obrigatório
  if (req.path.includes('/inicializar/atividade/')) {
    return next();
  }

  // Apenas métodos que esperam um corpo na requisição
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'O corpo (body) da requisição não foi fornecido ou está no formato incorreto.'
      });
    }
  }
  next();
};