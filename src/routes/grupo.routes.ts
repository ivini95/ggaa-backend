import { Router } from 'express';
import { GrupoController } from '../controllers/GrupoController.js';
import { TarefaGrupoController } from '../controllers/TarefaGrupoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  idParamSchema, 
  turmaIdParamSchema, 
  idAndAlunoIdParamSchema 
} from '../schemas/params.schema.js';
import { 
  criarTarefaGrupoSchema, 
  atualizarTarefaGrupoSchema 
} from '../schemas/tarefaGrupo.schema.js';

const grupoRoutes = Router();
const grupoController = new GrupoController();
const tarefaController = new TarefaGrupoController();

grupoRoutes.use(authMiddleware);

// --- Rotas de Grupo ---
grupoRoutes.post('/', (req, res) => grupoController.criar(req, res));
grupoRoutes.get('/turma/:turmaId', validate(turmaIdParamSchema), (req, res) => grupoController.listarPorTurma(req, res));

grupoRoutes.get('/:id', validate(idParamSchema), (req, res) => grupoController.buscarPorId(req, res));
grupoRoutes.post('/:id/integrantes', validate(idParamSchema), (req, res) => grupoController.adicionarIntegrante(req, res));
grupoRoutes.put('/:id', validate(idParamSchema), (req, res) => grupoController.atualizar(req, res));
grupoRoutes.delete('/:id', validate(idParamSchema), (req, res) => grupoController.deletar(req, res));

grupoRoutes.delete('/:id/integrantes/:alunoId', validate(idAndAlunoIdParamSchema), (req, res) => grupoController.removerIntegrante(req, res));

// --- Rotas de Tarefas do Grupo (RF11) ---
grupoRoutes.post('/:id/tarefas', validate(criarTarefaGrupoSchema), (req, res) => tarefaController.criar(req, res));
grupoRoutes.get('/:id/tarefas', validate(idParamSchema), (req, res) => tarefaController.listarPorGrupo(req, res));
grupoRoutes.put('/tarefas/:tarefaId', validate(atualizarTarefaGrupoSchema), (req, res) => tarefaController.atualizar(req, res));
grupoRoutes.delete('/tarefas/:tarefaId', (req, res) => tarefaController.deletar(req, res));

export { grupoRoutes };