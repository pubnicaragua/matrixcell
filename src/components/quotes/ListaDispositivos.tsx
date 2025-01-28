import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import axios from "../../axiosConfig"

interface Dispositivo {
  id: number
  marca: string
  modelo: string
  precio: number
}

export function ListaDispositivos({ onFirmarContrato }: { onFirmarContrato: (dispositivo: Dispositivo) => void }) {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("/devices")
        setDispositivos(response.data)
      } catch (err: any) {
        setError(err.message || "Error fetching devices")
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [])

  if (loading) return <p>Cargando dispositivos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Dispositivos Guardados</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {dispositivos.map((dispositivo) => (
            <li key={dispositivo.id}>
              <Card>
                <CardContent className="p-4">
                  <p>Marca: {dispositivo.marca}</p>
                  <p>Modelo: {dispositivo.modelo}</p>
                  <p>Precio + IVA: ${(dispositivo.precio * 1.12).toFixed(2)}</p>
                  <Button onClick={() => onFirmarContrato(dispositivo)} className="mt-2">
                    Firmar Contrato
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

