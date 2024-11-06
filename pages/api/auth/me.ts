import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken'; // Para verificar o JWT
import { parseCookies } from 'nookies'; // Para ler os cookies

const SECRET_KEY = 'your_secret_key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies({ req });
  const token = cookies.token; // O token JWT está no cookie "token"

  if (!token) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Retorna os dados do usuário decodificados
    return res.status(200).json(decoded);
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
