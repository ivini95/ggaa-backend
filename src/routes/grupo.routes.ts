import { Router } from 'express';
import { GrupoController } from '../controllers/GrupoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  idParamSchema, 
  turmaIdParamSchema, 
  idAndAlunoIdParamSchema 
} from '../schemas/params.schema.js';

const grupoRoutes = Router();
const grupoController = new GrupoController();

grupoRoutes.use(authMiddleware);

grupoRoutes.post('/', (req, res) => grupoController.criar(req, res));
grupoRoutes.get('/turma/:turmaId', validate(turmaIdParamSchema), (req, res) => grupoController.listarPorTurma(req, res));

grupoRoutes.get('/:id', validate(idParamSchema), (req, res) => grupoController.buscarPorId(req, res));
grupoRoutes.post('/:id/integrantes', validate(idParamSchema), (req, res) => grupoController.adicionarIntegrante(req, res));
grupoRoutes.put('/:id', validate(idParamSchema), (req, res) => grupoController.atualizar(req, res));
grupoRoutes.delete('/:id', validate(idParamSchema), (req, res) => grupoController.deletar(req, res));

// Protegido com o Schema Composto de :id e :alunoId
grupoRoutes.delete('/:id/integrantes/:alunoId', validate(idAndAlunoIdParamSchema), (req, res) => grupoController.removerIntegrante(req, res));

export { grupoRoutes };