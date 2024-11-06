import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { setCookie } from 'nookies';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { cpf },
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, cpf: user.cpf, company: user.company },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      setCookie({ res }, 'token', token, {
        maxAge: 60 * 60,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({ message: 'Autenticado com sucesso', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Método ${req.method} Não Permitido`);
}