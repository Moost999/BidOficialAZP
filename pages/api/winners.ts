// pages/api/winners.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getBets } from './BetsStore'; // Assegure-se que o caminho está correto

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bets = getBets(); // Obtém as apostas
    const results: Record<number, { userId: string; totalPoints: number; totalTickets: number; }> = {};

    bets.forEach(bet => {
      const { userId, eventId, apostas } = bet;

      // Verifique se 'apostas' é um array e itere sobre ele
      if (Array.isArray(apostas)) {
        apostas.forEach(aposta => {
          const { pontos, ingressos } = aposta;

          if (!results[eventId]) {
            results[eventId] = {
              userId,
              totalPoints: pontos,
              totalTickets: ingressos,
            };
          } else {
            // Acumula pontos e ingressos
            results[eventId].totalPoints += pontos;
            results[eventId].totalTickets += ingressos;
          }
        });
      }
    });

    // Organiza os resultados por evento e total de pontos
    const sortedResults = Object.entries(results).map(([eventId, data]) => ({
      eventId,
      userId: data.userId,
      totalPoints: data.totalPoints,
      totalTickets: data.totalTickets,
    })).sort((a, b) => b.totalPoints - a.totalPoints);

    return res.status(200).json(sortedResults);
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
