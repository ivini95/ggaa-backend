import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { turmaRoutes } from './routes/turma.routes.js';
import { alunoRoutes } from './routes/aluno.route.js';
import { grupoRoutes } from './routes/grupo.routes.js';
import { atividadeRoutes } from './routes/atividade.route.js';
import { entregaRoutes } from './routes/entrega.routes.js';
import { validateBodyMiddleware } from './middlewares/validateBody.middleware.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(validateBodyMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/atividades', atividadeRoutes);
app.use('/api/entregas', entregaRoutes);

app.get('/api/health', (req, res) => {
  return res.json({ 
    status: 'ok', 
    message: 'API do GGAA rodando perfeitamente!' 
  });
});

export default app;