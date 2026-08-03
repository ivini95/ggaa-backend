import { Router } from 'express';
import { AtividadeController } from '../controllers/AtividadeController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema, turmaIdParamSchema } from '../schemas/params.schema.js';

const atividadeRoutes = Router();
const atividadeController = new AtividadeController();

atividadeRoutes.use(authMiddleware);

// Rota de criação (usa req.body, validaremos o body depois se precisar)
atividadeRoutes.post('/', (req, res) => atividadeController.criar(req, res));

// 🛡️ Rota que usa :turmaId
atividadeRoutes.get('/turma/:turmaId', validate(turmaIdParamSchema), (req, res) => atividadeController.listarPorTurma(req, res));

// 🛡️ Rotas que usam :id
atividadeRoutes.get('/:id', validate(idParamSchema), (req, res) => atividadeController.buscarPorId(req, res));
atividadeRoutes.put('/:id', validate(idParamSchema), (req, res) => atividadeController.atualizar(req, res));
atividadeRoutes.delete('/:id', validate(idParamSchema), (req, res) => atividadeController.deletar(req, res));

export { atividadeRoutes };