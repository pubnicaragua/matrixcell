"use client"

import type React from "react"
import { useState } from "react"
import axios from "../axiosConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card"
import { Alert } from "../components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Security: React.FC = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    // Validaciones
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No se encontró la sesión")
      }

      // Configurar los headers con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      // Enviar la nueva contraseña al backend con los headers de autenticación
      const response = await axios.post("/auth/update-password", { newPassword }, config)

      setMessage(response.data.message)
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      if (err.message === "No se encontró la sesión") {
        setError("Sesión no válida. Por favor, inicia sesión nuevamente.")
        // Opcional: Redirigir al login
        // navigate('/login')
      } else {
        setError(
          err.response?.data?.message || "Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-700">Cambiar Contraseña</h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && <Alert type="success" title="Éxito" description={message} />}
            {error && <Alert type="error" title="Error" description={error} />}

            <div className="relative">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Security
