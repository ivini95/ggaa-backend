import { Router } from 'express';
import { GrupoController } from '../controllers/GrupoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const grupoRoutes = Router();
const grupoController = new GrupoController();

grupoRoutes.use(authMiddleware);

grupoRoutes.post('/', (req, res) => grupoController.criar(req, res));
grupoRoutes.get('/turma/:turmaId', (req, res) => grupoController.listarPorTurma(req, res));
grupoRoutes.get('/:id', (req, res) => grupoController.buscarPorId(req, res));
grupoRoutes.post('/:id/integrantes', (req, res) => grupoController.adicionarIntegrante(req, res));
grupoRoutes.delete('/:id/integrantes/:alunoId', (req, res) => grupoController.removerIntegrante(req, res));
grupoRoutes.put('/:id', (req, res) => grupoController.atualizar(req, res));
grupoRoutes.delete('/:id', (req, res) => grupoController.deletar(req, res));

export { grupoRoutes };