import { Router } from 'express';
import { EntregaController } from '../controllers/EntregaController';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../schemas/params.schema.js';

const entregaRoutes = Router();
const entregaController = new EntregaController();

entregaRoutes.use(authMiddleware);

// Inicializar pauta de entregas em lote para uma atividade
entregaRoutes.post('/inicializar/atividade/:atividadeId', (req, res) => entregaController.inicializarEntregasAtividade(req, res));

// Registrar ou atualizar individualmente
entregaRoutes.post('/', (req, res) => entregaController.registrarOuAtualizar(req, res));

// Atribuir nota/feedback para todos os alunos de um grupo de uma só vez
entregaRoutes.post('/grupo', (req, res) => entregaController.lancarNotaGrupo(req, res));

// Listar todas as entregas de uma atividade
entregaRoutes.get('/atividade/:atividadeId', (req, res) => entregaController.listarPorAtividade(req, res));

// Operações diretas pelo ID da entrega
entregaRoutes.get('/:id', validate(idParamSchema), (req, res) => entregaController.buscarPorId(req, res));
entregaRoutes.put('/:id', validate(idParamSchema), (req, res) => entregaController.atualizar(req, res));
entregaRoutes.delete('/:id', validate(idParamSchema), (req, res) => entregaController.deletar(req, res));

export { entregaRoutes };