import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Instanciando o cliente Prisma
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Busca todos os eventos no banco de dados
      const events = await prisma.event.findMany();
      return res.status(200).json(events);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      return res.status(500).json({ error: 'Erro ao buscar eventos.' });
    }
  }

  if (req.method === 'POST') {
    const { name, artist, date, time, venue, image } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !artist || !date || !time || !venue || !image) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      // Criação do novo evento no banco de dados usando Prisma
      const newEvent = await prisma.event.create({
        data: {
          name,
          artist,
          date,
          time,
          venue,
          image,
        },
      });

      // Retorna o evento criado com status 201 (Criado)
      return res.status(201).json(newEvent);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return res.status(500).json({ error: 'Erro ao criar evento.' });
    }
  }

  // Se o método não for GET ou POST, retorna erro 405 (Método não permitido)
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Método ${req.method} Não Permitido`);
}
