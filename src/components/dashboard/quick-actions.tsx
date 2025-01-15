import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Lock, UserPlus, FileText, PenToolIcon as Tool } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/blockdevice')}
          >
            <Lock className="mr-2 h-4 w-4" />
            Bloquear Dispositivo
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/addclient')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar Cliente
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/generate-invoice')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generar Factura
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/technicalservices')}
          >
            <Tool className="mr-2 h-4 w-4" />
            Registrar Servicio Técnico
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

