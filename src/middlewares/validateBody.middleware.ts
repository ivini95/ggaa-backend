import { Request, Response, NextFunction } from 'express';

export const validateBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Apenas metodos que esperam um corpo na requisicao
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'O corpo (body) da requisição não foi fornecido ou está no formato incorreto.'
      });
    }
  }
  next();
};