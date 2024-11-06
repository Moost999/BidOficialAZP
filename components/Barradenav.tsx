'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { 
  Home, 
  DollarSign,
  Stethoscope, 
  Users, 
  BookOpen, 
  LogIn, 
  Phone, 
  User, 
  Heart,
  Menu
} from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Preços', href: '/precos', icon: DollarSign },
  { name: 'Serviços', href: '/servicos', icon: Stethoscope },
  { name: 'Comunidade', href: '/comunidade', icon: Users },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Contato', href: '/contato', icon: Phone },
]

export default function Barradenav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-blue-200 shadow-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-start font-semibold font-sans text-blue-600">Viva Bem Psicologia</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className='bg-blue-500'>Entrar</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Registrar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default">
              <Stethoscope className="w-4 h-4 mr-2" />
              Sou Médico
            </Button>
            <Button variant="secondary">
              <Heart className="w-4 h-4 mr-2" />
              Sou Paciente
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <span className="sr-only">Abrir menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-2 py-2 text-base font-medium rounded-md",
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  <hr className="border-t border-gray-200" />
                  <Button variant="outline" className="justify-start" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-5 h-5 mr-3" />
                    Login
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setIsOpen(false)}>
                    <User className="w-5 h-5 mr-3" />
                    Registrar
                  </Button>
                  <Button variant="default" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Stethoscope className="w-5 h-5 mr-3" />
                    Sou Médico
                  </Button>
                  <Button variant="secondary" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Heart className="w-5 h-5 mr-3" />
                    Sou Paciente
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}