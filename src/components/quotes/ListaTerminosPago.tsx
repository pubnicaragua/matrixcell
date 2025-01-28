import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import axios from "../../axiosConfig"

interface TerminoPago {
  id: number
  device_id: number
  marca: string
  modelo: string
  months: number
  weekly_payment: number
  monthly_payment: number
  total_cost: number
}

export function ListaTerminosPago({ onMostrarProgreso }: { onMostrarProgreso: (termino: TerminoPago) => void }) {
  const [terminosPago, setTerminosPago] = useState<TerminoPago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTerminosPago = async () => {
      try {
        const [paymentPlansResponse, devicesResponse] = await Promise.all([
          axios.get("/payment-plans"),
          axios.get("/devices"),
        ])

        const devices = devicesResponse.data.reduce((acc: any, device: any) => {
          acc[device.id] = device
          return acc
        }, {})

        const terminos = paymentPlansResponse.data.map((plan: any) => ({
          id: plan.id,
          device_id: plan.device_id,
          marca: devices[plan.device_id]?.marca || "N/A",
          modelo: devices[plan.device_id]?.modelo || "N/A",
          months: plan.months,
          weekly_payment: plan.weekly_payment,
          monthly_payment: plan.monthly_payment,
          total_cost: plan.total_cost,
        }))

        setTerminosPago(terminos)
      } catch (err: any) {
        setError(err.message || "Error fetching payment plans")
      } finally {
        setLoading(false)
      }
    }

    fetchTerminosPago()
  }, [])

  if (loading) return <p>Cargando términos de pago...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Contratos Firmados</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {terminosPago.map((termino) => (
            <li key={termino.id}>
              <Card>
                <CardContent className="p-4">
                  <p>Marca: {termino.marca}</p>
                  <p>Modelo: {termino.modelo}</p>
                  <p>Plazo: {termino.months} meses</p>
                  <p>Pago Mensual: ${termino.monthly_payment.toFixed(2)}</p>
                  <p>Pago Semanal: ${termino.weekly_payment.toFixed(2)}</p>
                  <p>Costo Total: ${termino.total_cost.toFixed(2)}</p>
                  <Button onClick={() => onMostrarProgreso(termino)} className="mt-2">
                    Mostrar Progreso
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

