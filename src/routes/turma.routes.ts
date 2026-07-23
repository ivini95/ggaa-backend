import { Router } from 'express';
import { TurmaController } from '../controllers/TurmaController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const turmaRoutes = Router();
const turmaController = new TurmaController();

turmaRoutes.use(authMiddleware);

turmaRoutes.post('/', (req, res) => turmaController.criar(req, res));
turmaRoutes.get('/', (req, res) => turmaController.listar(req, res));
turmaRoutes.get('/:id', (req, res) => turmaController.buscarPorId(req, res));
turmaRoutes.put('/:id', (req, res) => turmaController.atualizar(req, res));
turmaRoutes.patch('/:id/status', (req, res) => turmaController.alterarStatus(req, res));
turmaRoutes.delete('/:id', (req, res) => turmaController.deletar(req, res));

export { turmaRoutes };