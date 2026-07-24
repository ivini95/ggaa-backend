import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { turmaRoutes } from './routes/turma.routes.js';
import { alunoRoutes } from './routes/aluno.route.js';

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições (req.body)

// Registra as rotas de Autenticação sob o prefixo /api/auth
app.use('/api/auth', authRoutes);

app.use('/api/turmas', turmaRoutes);

app.use('/api/alunos', alunoRoutes);

// Rota de teste/saúde da API
app.get('/api/health', (req, res) => {
  return res.json({ 
    status: 'ok', 
    message: 'API do GGAA rodando perfeitamente!' 
  });
});

export default app;