"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Lock, UserPlus, FileText, PenToolIcon as Tool } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LoginModal } from "../../components/LoginModal"

export function QuickActions() {
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [targetRoute, setTargetRoute] = useState("")

  const handleButtonClick = (route: string) => {
    setTargetRoute(route)
    setIsLoginModalOpen(true)
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    navigate(targetRoute)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full" onClick={() => handleButtonClick("/blockdevice")}>
            <Lock className="mr-2 h-4 w-4" />
            Bloquear Dispositivo
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleButtonClick("/addclient")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Cliente
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleButtonClick("/invoices")}>
            <FileText className="mr-2 h-4 w-4" />
            Generar Factura
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleButtonClick("/technicalservices")}>
            <Tool className="mr-2 h-4 w-4" />
            Registrar Servicio Técnico
          </Button>
        </div>
      </CardContent>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </Card>
  )
}

