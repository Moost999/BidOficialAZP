import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Instanciando o Prisma
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, eventId } = req.query;

    if (!userId || !eventId) {
      return res.status(400).json({ error: 'userId e eventId são obrigatórios' });
    }

    try {
      // Busca as apostas do usuário para o evento específico
      const bet = await prisma.bet.findFirst({
        where: {
          userId: String(userId),
          eventId: Number(eventId),
        },
        include: {
          apostas: true, // Inclui as apostas associadas
        },
      });

      if (!bet) {
        return res.status(404).json({ error: 'Aposta não encontrada para o usuário neste evento.' });
      }

      // Calcula a pontuação total
      const totalPoints = bet.apostas.reduce((acc, aposta) => acc + aposta.pontos, 0);

      return res.status(200).json({
        userId: bet.userId,
        fullName: bet.fullName,
        companyName: bet.companyName,
        eventName: bet.event.name,
        totalPoints,
        apostas: bet.apostas.map(aposta => ({
          ingressoId: aposta.ingressoId,
          pontos: aposta.pontos,
        })),
      });
    } catch (error) {
      console.error('Erro ao apurar apostas:', error);
      return res.status(500).json({ error: 'Erro ao apurar apostas' });
    }
  }

  // Se o método não for GET, retorna erro 405 (Método não permitido)
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Método ${req.method} Não Permitido`);
}
