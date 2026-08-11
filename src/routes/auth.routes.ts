import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', (req, res) => authController.registrar(req, res));
authRoutes.post('/login', (req, res, next) => authController.login(req, res, next));

// Rota protegida pelo middleware
authRoutes.get('/me', authMiddleware, (req, res) => authController.me(req, res));

export { authRoutes };