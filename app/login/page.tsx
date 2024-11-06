'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, CreditCard, Lock } from 'lucide-react'

export default function Login() {
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Função de login
 // Ao fazer o login e receber a resposta do back-end, armazene o token
const handleLogin = async () => {
  setLoading(true);
  setError('');

  // Envia os dados de login para a API de autenticação
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, cpf, company, password }),
  });

  const data = await response.json();

  if (response.ok) {
    console.log('Login bem-sucedido:', data);
    // Armazene o token JWT no localStorage ou em um cookie
    localStorage.setItem('jwt', data.token); // Supondo que a API retorne o token
    window.location.href = '/';  // Alterar para a rota real após o login
  } else {
    setError(data.error || 'Erro desconhecido');
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-[40%] right-[10%] w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300"></div>
        <div className="absolute bottom-[10%] left-[30%] w-36 h-36 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
      </div>

      <Card className="w-full max-w-md relative bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl opacity-50"></div>
        
        <CardHeader className="space-y-1 relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform -translate-y-10">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-br from-purple-700 to-pink-700 bg-clip-text text-transparent">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-center text-gray-600 font-medium">
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">CPF</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                id="cpf" 
                type="text" 
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="pl-10 h-11 border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-semibold text-gray-700">Empresa</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-full h-11 border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors rounded-xl">
                <SelectValue placeholder="Selecione sua empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allianz">Allianz Parque</SelectItem>
                <SelectItem value="wtorre">Wtorre</SelectItem>
                <SelectItem value="pnu">PNU</SelectItem>
                <SelectItem value="base">Base Coworking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <Label htmlFor="remember" className="text-sm text-gray-600">Lembrar de mim</Label>
            </div>
            <Button variant="link" className="px-0 font-semibold text-purple-600 hover:text-purple-700">
              Esqueceu a senha?
            </Button>
          </div>

          <Button 
            onClick={handleLogin} 
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-center pb-8 relative">
          <div className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Button variant="link" className="px-0 font-semibold text-purple-600 hover:text-purple-700">
              Registre-se
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
