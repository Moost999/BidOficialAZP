import { NextApiRequest, NextApiResponse } from 'next';
import { addBet, getBets } from './BetsStore'; // Funções para manipular apostas
import jwt from 'jsonwebtoken'; // Importa o jsonwebtoken para verificar o token JWT
import { user } from '../api/types/user'; // Ajuste conforme necessário para os tipos do seu usuário

// Função para verificar e decodificar o token JWT
const verifyToken = (token: string) => {
  try {
    // Suponha que a chave secreta seja a mesma usada para gerar o JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'default_secret_key') as user;
    return decoded;
  } catch (error) {
    return null; // Caso o token seja inválido ou expirado
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, eventId, apostas } = req.body;

    // Verifica se as apostas estão no formato correto
    if (!Array.isArray(apostas) || apostas.length > 4) {
      return res.status(400).json({ error: 'Você pode fazer no máximo 4 apostas.' });
    }

    // Verifica se cada objeto dentro de apostas possui ingressoId e pontos
    for (const aposta of apostas) {
      if (typeof aposta.ingressoId !== 'number' || typeof aposta.pontos !== 'number') {
        return res.status(400).json({ error: 'Cada aposta deve ter ingressoId e pontos como números.' });
      }
    }

    try {
      // Recupera o token JWT do cabeçalho Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
      }

      // O token geralmente vem como "Bearer <token>"
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token inválido ou não fornecido.' });
      }

      // Verifica e decodifica o token JWT
      const user = verifyToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado ou token inválido.' });
      }

      // Agora preenche as informações de `fullName` e `companyName` com base no usuário decodificado
      const fullName = user.name || 'Usuário não fornecido'; // Obtém o nome do usuário do JWT
      const companyName = user.company || 'Empresa não fornecida'; // Obtém o nome da empresa do JWT

      // Adiciona a aposta no banco de dados
      const bet = await addBet({
        userId: user.id, // ID do usuário a partir do token JWT
        eventId,
        fullName,
        companyName,
        apostas,
        id: 0,
      });

      // Retorna a resposta de sucesso
      return res.status(201).json({ message: 'Aposta criada com sucesso!', bet });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Erro ao adicionar a aposta.' });
    }
  }

  // Se o método não for GET ou POST, retorna erro 405 (Método não permitido)
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Método ${req.method} Não Permitido`);
}
