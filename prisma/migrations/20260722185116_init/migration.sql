-- CreateTable
CREATE TABLE "profs" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" SERIAL NOT NULL,
    "professor_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "semestre" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "turno" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma_alunos" (
    "turma_id" INTEGER NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "turma_alunos_pkey" PRIMARY KEY ("turma_id","aluno_id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" SERIAL NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_integrantes" (
    "grupo_id" INTEGER NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "grupo_integrantes_pkey" PRIMARY KEY ("grupo_id","aluno_id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" SERIAL NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "grupo_id" INTEGER,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_entrega" TIMESTAMP(3) NOT NULL,
    "peso" DECIMAL(5,2) NOT NULL,
    "valor_maximo" DECIMAL(5,2) NOT NULL,
    "criterios_avaliacao" TEXT,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas" (
    "id" SERIAL NOT NULL,
    "atividade_id" INTEGER NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "status_entrega" TEXT NOT NULL,
    "data_entrega" TIMESTAMP(3),
    "nota" DECIMAL(5,2) NOT NULL,
    "feedback" TEXT,
    "comentarios" TEXT,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas_grupo" (
    "id" SERIAL NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "aluno_id" INTEGER,
    "titulo" TEXT NOT NULL,
    "prazo" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "tarefas_grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diario_classes" (
    "id" SERIAL NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "conteudo_ministrado" TEXT NOT NULL,
    "objetivos" TEXT,
    "metodologia" TEXT,
    "recursos" TEXT,
    "atividade_realizada" TEXT,
    "ocorrencias" TEXT,
    "adaptacoes_realizadas" TEXT,
    "observacoes_gerais" TEXT,

    CONSTRAINT "diario_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" SERIAL NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "aluno_id" INTEGER,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptacoes_pedagogicas" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptacoes_pedagogicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_alteracoes" (
    "id" SERIAL NOT NULL,
    "professor_id" INTEGER NOT NULL,
    "tabela_afetada" TEXT NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "o_que_foi_alterado" TEXT NOT NULL,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_alteracoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profs_usuario_key" ON "profs"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "profs_email_key" ON "profs"("email");

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "profs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_alunos" ADD CONSTRAINT "turma_alunos_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_alunos" ADD CONSTRAINT "turma_alunos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_integrantes" ADD CONSTRAINT "grupo_integrantes_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_integrantes" ADD CONSTRAINT "grupo_integrantes_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas_grupo" ADD CONSTRAINT "tarefas_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas_grupo" ADD CONSTRAINT "tarefas_grupo_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diario_classes" ADD CONSTRAINT "diario_classes_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptacoes_pedagogicas" ADD CONSTRAINT "adaptacoes_pedagogicas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptacoes_pedagogicas" ADD CONSTRAINT "adaptacoes_pedagogicas_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_alteracoes" ADD CONSTRAINT "historico_alteracoes_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "profs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
