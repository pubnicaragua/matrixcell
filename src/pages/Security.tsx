"use client"

import type React from "react"
import { useState } from "react"
import api from "../axiosConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card"
import Alert from "../components/ui/alert-message"

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    // Validaciones básicas
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Las contraseñas nuevas no coinciden.",
      })
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      })
      setIsLoading(false)
      return
    }

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        setMessage({
          type: "error",
          text: "Debe iniciar sesión para cambiar la contraseña.",
        })
        return
      }

      // Configurar el header con el token
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Llamar al endpoint de actualización de contraseña
      const response = await api.post("auth/update-password", {
        currentPassword,
        newPassword,
      })

      setMessage({
        type: "success",
        text: "Contraseña actualizada correctamente.",
      })

      // Limpiar los campos
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al actualizar la contraseña.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-700">Seguridad de la Cuenta</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <Alert
                title={message.type === "success" ? "Éxito" : "Error"}
                description={message.text}
                type={message.type}
              />
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordChange} className="w-full" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Security

