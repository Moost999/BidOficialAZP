'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MusicIcon, TicketIcon, Trophy, User } from 'lucide-react'
import { motion } from 'framer-motion'

type Aposta = {
  ingressoId: number
  pontos: number
}

type BetData = {
  id: string
  userId: string
  eventId: number
  fullName: string
  companyName: string
  apostas: Aposta[]
}

type ProcessedBet = {
  userId: string
  fullName: string
  companyName: string
  ingressoId: number
  pontos: number
}

export default function ApostasResults() {
  const [resultados, setResultados] = useState<ProcessedBet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventName, setEventName] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/bets')
        if (!response.ok) {
          throw new Error('Falha ao buscar dados')
        }

        const data: BetData[] = await response.json()
        const processedData = processData(data)
        setResultados(processedData)
        if (data.length > 0) {
          setEventName(data[0].companyName)
        }
      } catch (error) {
        console.error('Erro ao buscar resultados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  const processData = (data: BetData[]): ProcessedBet[] => {
    const processedBets: ProcessedBet[] = []
    data.forEach(bet => {
      bet.apostas.forEach(aposta => {
        processedBets.push({
          userId: bet.userId,
          fullName: bet.fullName,
          companyName: bet.companyName,
          ingressoId: aposta.ingressoId,
          pontos: aposta.pontos
        })
      })
    })
    return processedBets.sort((a, b) => b.pontos - a.pontos)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-background to-secondary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (resultados.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Nenhum resultado disponível.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-background to-secondary min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-center mb-6 text-primary"
      >
        Resultados das Apostas
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-8 text-muted-foreground text-xl"
      >
        Confira as apostas para o evento!
      </motion.p>

      <Card className="mb-8 bg-card shadow-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center text-3xl">
            <MusicIcon className="mr-2" />
            {eventName}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Apostas ordenadas por valor (maior para menor)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {resultados.map((resultado, index) => (
              <motion.div 
                key={`${resultado.userId}-${resultado.ingressoId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Badge variant={index < 3 ? "default" : "secondary"} className="text-lg px-3 py-1">
                      {index === 0 ? <Trophy className="h-4 w-4" /> : `${index + 1}º`}
                    </Badge>
                    <div>
                      <h3 className="text-lg font-semibold">{resultado.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{resultado.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      <TicketIcon className="mr-1 h-4 w-4" />
                      Ingresso {resultado.ingressoId}
                    </Badge>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {resultado.pontos} pontos
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}