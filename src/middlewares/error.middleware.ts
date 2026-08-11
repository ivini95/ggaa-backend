import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Trata falha de conexão com o banco ou timeout do Prisma
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error.message.includes('Timed out fetching a new connection') ||
    error.message.includes("Can't reach database server")
  ) {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível. Não foi possível conectar ao banco de dados.'
    });
  }

  // Trata erros conhecidos do Prisma (restrições de banco, FK, etc)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      error: 'Erro de integridade de dados ao processar a requisição no banco.',
      code: error.code
    });
  }

  // Erros lançados via "throw new Error(...)" nos Services
  if (error instanceof Error && error.message) {
    return res.status(400).json({
      error: error.message
    });
  }

  // Erro padrão do servidor
  console.error('Erro não tratado:', error);
  return res.status(500).json({
    error: 'Ocorreu um erro interno no servidor.'
  });
}