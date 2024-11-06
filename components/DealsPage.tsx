'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Home, GraduationCap, UtensilsCrossed, Baby, Ticket, ShoppingCart, Plane, Calendar, Shirt } from 'lucide-react'

interface Deal {
  id: number
  company: string
  description: string
  image: string
  coupon: string
  category: string
}

export default function DealsPage() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  const deals: Deal[] = [
    {
      id: 1,
      company: "VitaMed",
      description: "Avaliação e teste gratuito",
      image: "/placeholder.svg",
      coupon: "VITA10OFF",
      category: "Saúde"
    },
    {
      id: 2,
      company: "Odontologia Express",
      description: "Odontologia Master",
      image: "/placeholder.svg",
      coupon: "ODONTO20",
      category: "Saúde"
    },
    {
      id: 3,
      company: "Sara's Care",
      description: "Saúde e Vida",
      image: "/placeholder.svg",
      coupon: "SARA15OFF",
      category: "Saúde"
    },
    {
      id: 4,
      company: "Onodera",
      description: "Onodera Rosa",
      image: "/placeholder.svg",
      coupon: "ONO25OFF",
      category: "Saúde"
    },
  ]

  const categories = [
    { icon: <Home className="w-5 h-5" />, label: "BEM ESTAR" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "EDUCAÇÃO" },
    { icon: <UtensilsCrossed className="w-5 h-5" />, label: "GASTRONOMIA" },
    { icon: <Baby className="w-5 h-5" />, label: "INFANTIL" },
    { icon: <Ticket className="w-5 h-5" />, label: "LAZER E CULTURA" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "PRODUTOS E SERVIÇOS" },
    { icon: <Plane className="w-5 h-5" />, label: "VIAGENS" },
    { icon: <Calendar className="w-5 h-5" />, label: "DATAS ESPECIAIS" },
    { icon: <Shirt className="w-5 h-5" />, label: "MODA" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">Beneficios Colaboradores</h1>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-white shadow-lg">
          <div className="flex w-max space-x-4 p-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-2 hover:bg-blue-100 transition-colors"
              >
                {category.icon}
                <span className="text-xs font-medium text-blue-800">{category.label}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
          {deals.map((deal) => (
            <Dialog key={deal.id}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer transform transition-all hover:scale-105">
                  <div className="relative overflow-hidden rounded-lg border bg-white shadow-lg hover:shadow-xl">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold rounded-bl-lg">
                      {deal.category}
                    </div>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.company}
                        className="object-cover w-full h-full transition-transform group-hover:scale-110"
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-base text-blue-800">{deal.company}</h3>
                      <p className="text-xs text-blue-600">{deal.description}</p>
                      <Button 
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs py-1"
                        onClick={() => setSelectedDeal(deal)}
                      >
                        UTILIZAR EXPERIÊNCIA
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-blue-800">Seu cupom de desconto</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-4">
                  <div className="text-3xl font-bold border-4 border-dashed border-blue-600 p-6 rounded-md bg-blue-100 text-blue-800">
                    {deal.coupon}
                  </div>
                  <p className="text-center text-sm text-blue-600">
                    Copie o código acima e utilize no checkout para obter seu desconto!
                  </p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    onClick={() => navigator.clipboard.writeText(deal.coupon)}
                  >
                    Copiar Código
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  )
}