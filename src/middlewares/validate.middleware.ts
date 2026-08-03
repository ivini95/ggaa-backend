import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

export function validate(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        params: req.params,
        body: req.body,
        query: req.query,
      });

      // Atribuímos os params limpos/convertidos com segurança
      if (parsed && typeof parsed === 'object' && 'params' in parsed) {
        req.params = (parsed as any).params;
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