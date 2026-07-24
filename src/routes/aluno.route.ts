import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const alunoRoutes = Router();
const alunoController = new AlunoController();

alunoRoutes.use(authMiddleware);

alunoRoutes.post('/', (req, res) => alunoController.criar(req, res));
alunoRoutes.get('/', (req, res) => alunoController.listar(req, res));
alunoRoutes.get('/:id', (req, res) => alunoController.buscarPorId(req, res));
alunoRoutes.post('/:id/vincular-turma', (req, res) => alunoController.vincularATurma(req, res));
alunoRoutes.patch('/:id/turma/:turmaId/status', (req, res) => alunoController.alterarStatusNaTurma(req, res));
alunoRoutes.delete('/:id/desvincular-turma/:turmaId', (req, res) => alunoController.desvincularDeTurma(req, res));
alunoRoutes.put('/:id', (req, res) => alunoController.atualizar(req, res));
alunoRoutes.delete('/:id', (req, res) => alunoController.deletar(req, res));

export { alunoRoutes };