import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições (req.body)

// Rota de teste/saúde da API
app.get('/api/health', (req, res) => {
  return res.json({ 
    status: 'ok', 
    message: 'API do GGAA rodando perfeitamente!' 
  });
});

export default app;