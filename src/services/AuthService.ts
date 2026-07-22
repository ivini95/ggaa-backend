import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

interface RegistrarProfessorDTO {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
}

interface LoginDTO {
  usuarioOuEmail: string;
  senha: string;
}

export class AuthService {
  // 1. Cadastrar Novo Professor
  async registrar({ nome, usuario, email, senha }: RegistrarProfessorDTO) {
    // Verifica se já existe usuário ou email cadastrado
    const professorExistente = await prisma.professor.findFirst({
      where: {
        OR: [{ email }, { usuario }]
      }
    });

    if (professorExistente) {
      throw new Error('E-mail ou nome de usuário já estão em uso.');
    }

    // Gera o Hash da senha (custo 8 para boa velocidade x segurança)
    const senhaHash = await bcrypt.hash(senha, 8);

    // Cria o registro no banco
    const professor = await prisma.professor.create({
      data: {
        nome,
        usuario,
        email,
        senhaHash
      },
      select: {
        id: true,
        nome: true,
        usuario: true,
        email: true,
        criadoEm: true
      }
    });

    return professor;
  }

  // 2. Autenticar Professor (Login)
  async login({ usuarioOuEmail, senha }: LoginDTO) {
    // Busca pelo usuário OU pelo email
    const professor = await prisma.professor.findFirst({
      where: {
        OR: [
          { email: usuarioOuEmail },
          { usuario: usuarioOuEmail }
        ]
      }
    });

    if (!professor) {
      throw new Error('Credenciais inválidas.');
    }

    // Compara a senha enviada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, professor.senhaHash);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    // Gerar o Token JWT (expira em 1 dia)
    const secret = process.env.JWT_SECRET || 'secret_default';
    const token = jwt.sign(
      { 
        id: professor.id, 
        nome: professor.nome,
        email: professor.email 
      },
      secret,
      { expiresIn: '1d' }
    );

    return {
      professor: {
        id: professor.id,
        nome: professor.nome,
        usuario: professor.usuario,
        email: professor.email
      },
      token
    };
  }
}