import { Router } from 'express';
import { DiarioController } from '../controllers/DiarioController.js';
import { validate } from '../middlewares/validate.middleware.js';
import { criarDiarioSchema, atualizarDiarioSchema } from '../schemas/diario.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const diarioRoutes = Router();
const diarioController = new DiarioController();

diarioRoutes.use(authMiddleware);

diarioRoutes.post(
  '/',
  validate(criarDiarioSchema),
  diarioController.registrarAula
);

diarioRoutes.get(
  '/turma/:turmaId',
  diarioController.listarPorTurma
);

diarioRoutes.put(
  '/:id',
  validate(atualizarDiarioSchema),
  diarioController.atualizarAula
);

diarioRoutes.delete(
  '/:id',
  diarioController.deletarAula
);

export { diarioRoutes };