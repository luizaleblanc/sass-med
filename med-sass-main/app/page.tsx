"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, Mail, ArrowLeft } from "lucide-react"
import Dashboard from "./dashboard"

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [isRecoveryEmailSent, setIsRecoveryEmailSent] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de login - em produção, validar credenciais
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (forgotPasswordEmail) {
      // Simular envio de email de recuperação
      setIsRecoveryEmailSent(true)
      // Resetar após 3 segundos
      setTimeout(() => {
        setIsRecoveryEmailSent(false)
        setForgotPasswordEmail("")
        setShowForgotPassword(false)
      }, 3000)
    }
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
    setIsRecoveryEmailSent(false)
  }

  if (isLoggedIn) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Centered Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            {/* Main logo container with gradient */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg flex items-center justify-center relative">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="medico@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5">
                Entrar no Sistema
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseForgotPassword}
                  className="p-1 h-8 w-8 text-blue-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-blue-900">Recuperar Senha</CardTitle>
                  <CardDescription className="text-blue-600">
                    Digite seu email para receber as instruções de recuperação
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isRecoveryEmailSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail" className="text-blue-900">
                      Email cadastrado
                    </Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="medico@exemplo.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Instruções
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseForgotPassword}
                      className="flex-1 border-blue-200 text-blue-700 bg-transparent"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Email Enviado!</h3>
                    <p className="text-blue-600 text-sm">Enviamos as instruções de recuperação para:</p>
                    <p className="text-blue-800 font-medium">{forgotPasswordEmail}</p>
                    <p className="text-blue-600 text-sm mt-2">Verifique sua caixa de entrada e spam.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
