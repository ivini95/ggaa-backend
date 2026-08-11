import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export class AuthController {
  // POST /api/auth/register
  async registrar(req: Request, res: Response) {
    try {
      const { nome, usuario, email, senha } = req.body;

      if (!nome || !usuario || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      const professor = await authService.registrar({ nome, usuario, email, senha });

      return res.status(201).json({
        message: 'Professor cadastrado com sucesso!',
        professor
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioOuEmail, senha } = req.body;

      if (!usuarioOuEmail || !senha) {
        return res.status(400).json({ error: 'Usuário/E-mail e senha são obrigatórios.' });
      }

      const resultado = await authService.login({ usuarioOuEmail, senha });

      return res.json(resultado);
    } catch (error: any) {
      next(error);
      return res.status(401).json({ error: error.message });
    }
  }

  // GET /api/auth/me (Rota Protegida)
  async me(req: Request, res: Response) {
    try {
      const { prisma } = await import('../lib/prisma.js');
      
      const professor = await prisma.professor.findUnique({
        where: { id: req.professorId },
        select: {
          id: true,
          nome: true,
          usuario: true,
          email: true,
          criadoEm: true
        }
      });

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado.' });
      }

      return res.json({ professor });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

