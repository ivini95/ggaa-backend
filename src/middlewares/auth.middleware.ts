import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  nome: string;
  email: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  // O formato esperado do cabeçalho é "Bearer <TOKEN>"
  const parts = authorization.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do Token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret_default';
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Injeta o ID do professor autenticado na requisição
    req.professorId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}