// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

export function validate(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Tenta validar apenas o req.body primeiro (Schemas diretos de DTO)
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = await schema.parseAsync(req.body);
      } else {
        // 2. Se for um schema envelopado com params/query
        const parsed = await schema.parseAsync({
          params: req.params,
          body: req.body,
          query: req.query,
        });

        if (parsed && typeof parsed === 'object') {
          if ('params' in parsed) req.params = (parsed as any).params;
          if ('body' in parsed) req.body = (parsed as any).body;
        }
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Parâmetro ou dado inválido informado na requisição.',
          detalhes: error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensagem: issue.message,
          })),
        });
      }
      return res.status(500).json({ error: 'Erro interno na validação.' });
    }
  };
}