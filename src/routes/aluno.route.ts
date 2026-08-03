import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  idParamSchema, 
  idAndTurmaIdParamSchema 
} from '../schemas/params.schema.js';

const alunoRoutes = Router();
const alunoController = new AlunoController();

alunoRoutes.use(authMiddleware);

alunoRoutes.post('/', (req, res) => alunoController.criar(req, res));
alunoRoutes.get('/', (req, res) => alunoController.listar(req, res));

// Protegidos com o Schema de :id
alunoRoutes.get('/:id', validate(idParamSchema), (req, res) => alunoController.buscarPorId(req, res));
alunoRoutes.put('/:id/trocar-turma', validate(idParamSchema), (req, res) => alunoController.trocarTurma(req, res));
alunoRoutes.put('/:id', validate(idParamSchema), (req, res) => alunoController.atualizar(req, res));
alunoRoutes.delete('/:id', validate(idParamSchema), (req, res) => alunoController.deletar(req, res));

// Protegido com o Schema Composto de :id e :turmaId
alunoRoutes.patch('/:id/turma/:turmaId/status', validate(idAndTurmaIdParamSchema), (req, res) => alunoController.alterarStatusNaTurma(req, res));

export { alunoRoutes };