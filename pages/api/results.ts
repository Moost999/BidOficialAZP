import { NextApiRequest, NextApiResponse } from 'next';
import { getBets } from './BetsStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bets = getBets();
    console.log('Apostas disponíveis:', bets);

    if (bets.length === 0) {
      return res.status(404).json({ message: 'Nenhuma aposta encontrada.' });
    }

    // Estrutura para armazenar os resultados agrupados por usuário
    const results: Record<string, {
      userId: string;
      fullName: string;
      companyName: string;
      totalPoints: number;
      totalTickets: number;
      maxPoints: number;
      apostaCount: number; // Nova propriedade para contar as apostas
    }> = {};

    bets.forEach(bet => {
      const { userId, fullName, companyName, apostas } = bet;

      // Inicializa o usuário se ainda não estiver no results
      if (!results[userId]) {
        results[userId] = {
          userId,
          fullName,
          companyName,
          totalPoints: 0,
          totalTickets: 0,
          maxPoints: 0,
          apostaCount: 0,
        };
      }

      // Adiciona os dados das apostas
      apostas.forEach(aposta => {
        const { pontos } = aposta;

        results[userId].totalPoints += pontos;
        results[userId].totalTickets += 1; // Contabiliza cada ingresso
        results[userId].apostaCount += 1;   // Incrementa o número total de apostas

        // Verifica se a nova aposta é a de maior pontuação
        if (pontos > results[userId].maxPoints) {
          results[userId].maxPoints = pontos;
        }
      });
    });

    // Converte o objeto results para uma lista e ordena
    const sortedResults = Object.values(results)
      .sort((a, b) => {
        // Primeiro ordena pelo número de apostas (apostaCount)
        if (b.apostaCount === a.apostaCount) {
          // Se o número de apostas for igual, ordena pelo total de pontos
          return b.totalPoints - a.totalPoints;
        }
        return b.apostaCount - a.apostaCount; // Ordena pelo número de apostas
      });

    return res.status(200).json(sortedResults);
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}