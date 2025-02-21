"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
  targetRoute: string  // <- Prop obligatoria
}


export function LoginModal({ isOpen, onClose, onLoginSuccess, targetRoute }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor completa todos los campos.")
      return
    }

    try {
      await login(email, password)
      setEmail("")
      setPassword("")
      onLoginSuccess()

      // Navegar a la ruta de destino y forzar una recarga
      navigate(targetRoute, { replace: true })
      window.location.reload()
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Usuario o contraseña incorrectos. Por favor verifica tus datos.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificar acceso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Verificar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

