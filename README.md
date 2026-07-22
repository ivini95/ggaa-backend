# GGAA - Gestão de Grupos e Acompanhamento de Aprendizagem

> API RESTful desenvolvida em **Node.js, Express, TypeScript, Prisma ORM e PostgreSQL**, focada na gestão pedagógica de turmas, controle de entregas, avaliações por grupos, diário de classe e registro de ocorrências para professores.

---

## Visão Geral do Projeto

O **GGAA** é uma plataforma concebida para simplificar a rotina docente, centralizando em um só lugar a organização de turmas, o acompanhamento do desempenho individual e em equipe dos alunos, o registro de conteúdos diários e o histórico de intervenções pedagógicas.

O projeto foi construído seguindo os princípios de **Arquitetura em Camadas (Layered Architecture)**, priorizando separação de responsabilidades, tipagem estática rigorosa com TypeScript, rastreabilidade de dados e facilidade de manutenção.

---

## Tecnologias e Ferramentas

### **Backend & Banco de Dados**
* **Node.js** (Ambiente de execução)
* **TypeScript** (Tipagem estática e segurança)
* **Express.js** (Framework web HTTP)
* **Prisma ORM** (Modelagem, consultas e controle de migrações SQL)
* **PostgreSQL 16** (Banco de dados relacional)
* **Docker & Docker Compose** (Containerização da infraestrutura local)

### **Segurança & Qualidade de Código**
* **JWT (JSON Web Token)** (Autenticação stateless de professores)
* **Bcrypt.js** (Criptografia hash de senhas)
* **CORS & Dotenv** (Segurança HTTP e gestão de variáveis de ambiente)

---

## Arquitetura & Design do Banco de Dados

A aplicação utiliza um banco relacional modelado para garantir integridade referencial com **exclusões em cascata (`CASCADE`)** e suporte a **operações transacionais**.

```text
[ Cliente HTTP / Front-end ]
              │
         (REST / JSON)
              ▼
   [ Express Router / Middlewares ] ──► (Auth JWT & Validações)
              │
              ▼
     [ Controllers Layer ]        ──► (Tratamento de req/res HTTP)
              │
              ▼
      [ Services / UseCases ]     ──► (Regras de negócio do sistema)
              │
              ▼
    [ Prisma ORM / PostgreSQL ]    ──► (Acesso ao banco containerizado no Docker)

# GGAA Backend

## Principais Módulos do Sistema

- **Professores & Autenticação:** Gestão de acesso com senhas criptografadas e log de auditoria de alterações.
- **Turmas & Alunos:** Matrícula em lote, controle de status do aluno e associação muitos-para-muitos (N:M).
- **Grupos & Divisão de Tarefas:** Criação de equipes por turma e distribuição interna de tarefas.
- **Atividades & Avaliações:** Criação de atividades individuais ou em grupo, matriz de notas e critérios de avaliação.
- **Diário de Classe & Ocorrências:** Registro sequencial de aulas ministradas e diário de adaptações pedagógicas.

---

# 🚀 Como Executar o Projeto Localmente

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- Node.js (versão 18 ou superior)
- Git
- Docker Desktop (com Docker Compose ativo)

## Passo a Passo

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/ggaa-backend.git
cd ggaa-backend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/ggaa?schema=public"
PORT=3333
JWT_SECRET="sua_chave_secreta_aqui"
```

### 4. Subir o banco de dados

```bash
docker compose up -d
```

### 5. Executar as migrações do Prisma

```bash
npx prisma migrate dev
```

### 6. Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em:

- http://localhost:3333

Validação da API:

- http://localhost:3333/api/health

---

# 📂 Estrutura de Pastas

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

### Descrição

| Pasta/Arquivo | Descrição |
|---------------|-----------|
| `prisma/schema.prisma` | Definição dos modelos e relacionamentos do banco |
| `prisma/migrations` | Histórico das migrações SQL |
| `src/config` | Configurações e variáveis de ambiente |
| `src/controllers` | Controladores das requisições HTTP |
| `src/lib` | Instância única do Prisma Client |
| `src/middlewares` | Middlewares de autenticação e autorização |
| `src/routes` | Rotas da API REST |
| `src/services` | Regras de negócio |
| `src/app.ts` | Configuração do Express |
| `src/server.ts` | Inicialização do servidor |

---

# 📝 Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

## Desenvolvedor

Desenvolvido por **Seu Nome**

- LinkedIn
- GitHub

