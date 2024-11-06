import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt'; // Use bcryptjs para compatibilidade com Node.js
import prisma from '../../../lib/db'; // Certifique-se de que você tem o Prisma configurado corretamente

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cpf, senha, name, empresa } = req.body;

    // Verificação de campos obrigatórios
    if (!cpf || !senha || !name || !empresa) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      // Verifica se o CPF já existe
      const existingUser = await prisma.user.findUnique({
        where: { cpf },
      });

      if (existingUser) {
        return res.status(409).json({ message: 'CPF já cadastrado.' });
      }

      // Cria o hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o número de rounds para o bcrypt

      // Cria o novo usuário no banco de dados
      const newUser = await prisma.user.create({
        data: {
          name,
          cpf,
          password: hashedPassword,
          company: empresa, // Use 'company' aqui
          points: 100, // Inicia com 100 pontos, você pode ajustar isso conforme necessário
        },
      });

      res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: 'Erro ao registrar usuário.', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
