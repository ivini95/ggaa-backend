import { Router } from 'express';
import { TurmaController } from '../controllers/TurmaController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../schemas/params.schema.js';

const turmaRoutes = Router();
const turmaController = new TurmaController();

turmaRoutes.use(authMiddleware);

// Rota de criação e listagem geral (não usam ID na URL)
turmaRoutes.post('/', (req, res) => turmaController.criar(req, res));
turmaRoutes.get('/', (req, res) => turmaController.listar(req, res));

// 🛡️ Rotas que recebem :id envelopadas pelo middleware do Zod
turmaRoutes.get('/:id/alunos', validate(idParamSchema), (req, res) => turmaController.listarAlunos(req, res));
turmaRoutes.get('/:id', validate(idParamSchema), (req, res) => turmaController.buscarPorId(req, res));
turmaRoutes.put('/:id', validate(idParamSchema), (req, res) => turmaController.atualizar(req, res));
turmaRoutes.patch('/:id/status', validate(idParamSchema), (req, res) => turmaController.alterarStatus(req, res));
turmaRoutes.delete('/:id', validate(idParamSchema), (req, res) => turmaController.deletar(req, res));

export { turmaRoutes };