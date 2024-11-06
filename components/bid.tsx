'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Ticket, Plus, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseCookies } from 'nookies';

interface Show {
  id: string;
  name: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  image: string;
}

interface BetLine {
  id: number;
  points: string;
}

interface UserBalance {
  id: string;
  points: number;
  name: string;
  company: string;
}

const initialUserBalance: UserBalance = {
  id: '',
  points: 0,
  name: '',
  company: ''
};

export default function Bid() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [betLines, setBetLines] = useState<BetLine[]>([{ id: 1, points: '' }]);
  const [userBalance, setUserBalance] = useState<UserBalance>(initialUserBalance);
  const [show, setShow] = useState<Show | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchShow(), fetchUser()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchShow = async () => {
    try {
      const response = await axios.get<Show[]>('/api/events');
      if (response.data.length > 0) {
        setShow(response.data[0]);
      } else {
        toast.warning('Nenhum show encontrado.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do show:', error);
      toast.error('Não foi possível carregar os dados do show.', { position: 'top-center' });
    }
  };

  const fetchUser = async () => {
    try {
      let token = localStorage.getItem('jwt');
      if (!token) {
        const cookies = parseCookies();
        token = cookies.token;
      }

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get<UserBalance>('/api/users', {
        headers: { Authorization: `Bearer ${token.trim()}` }
      });

      if (response.data) {
        setUserBalance(response.data);
      } else {
        throw new Error('Dados do usuário não encontrados');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Sessão expirada ou token inválido. Por favor, faça login novamente.', { position: 'top-center' });
          localStorage.removeItem('jwt');
          router.push('/login');
        } else if (error.response?.status === 500) {
          toast.error('Erro interno do servidor. Por favor, tente novamente mais tarde.', { position: 'top-center' });
        } else {
          toast.error(`Erro ao carregar informações do usuário: ${error.response?.data?.message || 'Erro desconhecido'}`, { position: 'top-center' });
        }
      } else {
        toast.error('Erro ao carregar informações do usuário. Por favor, tente novamente.', { position: 'top-center' });
      }
    }
  };

  const addBetLine = () => {
    if (betLines.length < 4) {
      setBetLines([...betLines, { id: Date.now(), points: '' }]);
    } else {
      toast.warning('Máximo de 4 ingressos permitido!', { position: 'top-center' });
    }
  };

  const removeBetLine = (id: number) => {
    setBetLines(betLines.filter(line => line.id !== id));
  };

  const updateBetPoints = (id: number, points: string) => {
    setBetLines(betLines.map(line => line.id === id ? { ...line, points } : line));
  };

  const handleBetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (betLines.some(line => line.points === '')) {
      toast.error('Por favor, preencha todos os campos de pontos.', { position: 'top-center' });
      return;
    }
  
    const totalBetPoints = betLines.reduce((total, line) => total + parseInt(line.points), 0);
  
    if (totalBetPoints > userBalance.points) {
      toast.error('Você não tem pontos suficientes para esta aposta.', { position: 'top-center' });
      return;
    }
  
    let token = localStorage.getItem('jwt');
    if (!token) {
      const cookies = parseCookies();
      token = cookies.token;
    }

    if (!token) {
      toast.error('Usuário não autenticado.', { position: 'top-center' });
      router.push('/login');
      return;
    }
  
    try {
      const response = await axios.post('/api/bets', {
        userId: userBalance.id,
        bets: betLines,
      }, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });
  
      if (response.status === 200) {
        const newBalance = userBalance.points - totalBetPoints;
        await axios.put('/api/users', {
          userId: userBalance.id,
          newPoints: newBalance,
        }, {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          }
        });
  
        setUserBalance(prevBalance => ({
          ...prevBalance,
          points: newBalance
        }));
  
        toast.success('Aposta realizada com sucesso!', { position: 'top-center' });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao enviar apostas:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.', { position: 'top-center' });
        localStorage.removeItem('jwt');
        router.push('/login');
      } else {
        toast.error('Erro ao realizar aposta. Por favor, tente novamente.', { position: 'top-center' });
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-white text-2xl font-bold">Carregando...</div>
    </div>;
  }

  if (!show) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-white text-2xl font-bold">Nenhum show disponível no momento.</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">Cortesia Bid</div>
          <Link href='/BidResults' className="text-purple-600 hover:text-purple-800 transition-colors">Apurar</Link>
          <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-600 font-medium">
            Seus Pontos: {userBalance.points}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 flex items-center justify-center">
        <Card className="w-full max-w-md overflow-hidden bg-white/90 backdrop-blur-md shadow-xl rounded-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader className="relative p-0">
              <img src={show.image} alt={show.name} className="w-full h-56 object-cover rounded-t-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <CardTitle className="text-white text-3xl font-bold mb-2">{show.name}</CardTitle>
                <CardDescription className="text-gray-200 text-lg">{show.artist}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                {new Date(show.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-2 h-5 w-5 text-purple-500" />
                {show.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-5 w-5 text-purple-500" />
                {show.venue}
              </div>
              <div className="flex w-full">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Ticket className="mr-2" />
                  Apostar em Ingressos
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Faça sua Aposta</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Escolha a quantidade de ingressos e os pontos para cada aposta.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBetSubmit} className="space-y-4">
                    <AnimatePresence>
                      <div className="grid grid-cols-1 gap-4">
                        {betLines.map((line, index) => (
                          <motion.div
                            key={line.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 p-3 rounded-lg shadow-inner flex items-center justify-between"
                          >
                            <Label htmlFor={`bet-${line.id}`} className="text-lg font-semibold text-gray-700">
                              Ingresso {index + 1}
                            </Label>
                            <div className="flex items-center space-x-2 w-full max-w-[200px]">
                              <Input
                                id={`bet-${line.id}`}
                                type="number"
                                placeholder="Pontos"
                                value={line.points}
                                onChange={(e) => updateBetPoints(line.id, e.target.value)}
                                className="text-lg w-full"
                                min={0}
                              />
                              <span className="text-gray-600 font-medium">pts</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBetLine(line.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Remover ingresso</span>
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                    <Button
                      type="button"
                      onClick={addBetLine}
                      className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-2 rounded-lg transition duration-300 ease-in-out"
                      disabled={betLines.length >= 4}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Adicionar Ingresso
                    </Button>
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        Confirmar Aposta
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </motion.div>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
}