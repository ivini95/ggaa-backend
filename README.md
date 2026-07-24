
## Visão Geral do Projeto

O **GGAA** é uma plataforma concebida para simplificar a rotina docente, centralizando em um só lugar a organização de turmas, o acompanhamento do desempenho individual e em equipe dos alunos, o registro de conteúdos diários e o histórico de intervenções pedagógicas.

O projeto foi construído seguindo os princípios de **Arquitetura em Camadas (Layered Architecture)**, priorizando separação de responsabilidades, tipagem estática rigorosa com TypeScript, rastreabilidade de dados e facilidade de manutenção.

---

## GGAA - Gestão de Grupos e Acompanhamento de Aprendizagem

API RESTful em **Node.js, Express, TypeScript e PostgreSQL**, projetada para centralizar a gestão pedagógica de turmas, avaliações em grupo, diário de classe e acompanhamento individual de alunos.

---

## Tech Stack & Arquitetura

* **Core:** Node.js | TypeScript | Express.js
* **Banco de Dados & ORM:** PostgreSQL 16 | Prisma ORM (Migrations & Transactions)
* **Infraestrutura & Segurança:** Docker Compose | JWT Auth | Bcrypt.js
* **Padrão Arquitetural:** Layered Architecture (Controllers -> Services -> Repositories)

---

## Principais Recursos

* **Autenticação Stateless:** Login de professores com senhas criptografadas via Bcrypt e tokens JWT.
* **Gestão de Turmas & Alunos:** Matrícula em lote e relacionamentos N:M.
* **Avaliações em Equipe:** Criação de grupos com divisão interna de tarefas e matriz de notas.
* **Diário de Classe & Ocorrências:** Registro histórico de aulas, adaptações pedagógicas e logs de alterações.

---

## Como Executar o Projeto

### Pré-requisitos
* Node.js (v18+) e Docker Desktop ativos.

### Passo a Passo

```bash
# 1. Instalar dependências
npm install

# 2. Subir o PostgreSQL no Docker
docker compose up -d

# 3. Rodar as migrações do banco
npx prisma migrate dev

# 4. Iniciar a aplicação
npm run dev

Desenvolvido por Antonio Vinicius Ximenes — LinkedIn | GitHub