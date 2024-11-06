import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para retornar todas as apostas com informações completas
export async function getBets() {
  try {
    const bets = await prisma.bet.findMany({
      include: {
        apostas: true,  // Inclui as apostas associadas
        event: true,    // Inclui os eventos associados
      },
    });

    return bets.map(bet => ({
      id: bet.id,
      userId: bet.userId,
      fullName: bet.fullName,
      companyName: bet.companyName,
      eventName: bet.event.name,
      eventDate: bet.event.date,
      apostas: bet.apostas.map(aposta => ({
        ingressoId: aposta.ingressoId,
        pontos: aposta.pontos,
      })),
    }));
  } catch (error) {
    console.error('Erro ao buscar apostas:', error);
    throw new Error('Erro ao buscar apostas');
  }
}

// Função para adicionar uma nova aposta
export async function addBet(betData: {
  id: number;
  userId: string;
  eventId: number;
  fullName: string;
  companyName: string;
  apostas: Array<{ ingressoId: number; pontos: number }>;
}) {
  // Verifica se o evento existe
  const event = await prisma.event.findUnique({
    where: { id: betData.eventId },
  });

  if (!event) {
    throw new Error('Evento não encontrado!');

  }

  if(addBet.length > 4){
    throw new Error('Maximo 4 Apostas')
  }

  // Cria a aposta no banco de dados
  const bet = await prisma.bet.create({
    data: {
      userId: betData.userId,
      fullName: betData.fullName,
      companyName: betData.companyName,
      eventId: betData.eventId,
      apostas: {
        create: betData.apostas,  // Cria as apostas associadas
      },
    },
  });

  return bet;
}
