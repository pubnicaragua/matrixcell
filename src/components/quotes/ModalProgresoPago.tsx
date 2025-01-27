import { useState } from "react"
import type { TerminoPago } from "../../pages/types"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

export function ModalProgresoPago({
  termino,
  onCerrar,
  onRealizarPago,
}: {
  termino: TerminoPago
  onCerrar: () => void
  onRealizarPago: (termino: TerminoPago) => void
}) {
  const [fechaActual] = useState(new Date())

  const calcularTiempoRestante = () => {
    return termino.pagosPendientes
  }

  const calcularFechaProximoPago = () => {
    const fechaProximoPago = new Date(termino.fechaInicio)
    fechaProximoPago.setMonth(fechaProximoPago.getMonth() + (termino.plazo - termino.pagosPendientes + 1))
    return fechaProximoPago.toLocaleDateString()
  }

  const calcularPorcentajeProgreso = () => {
    const montoTotal = termino.costoTotal
    const montoInicial = termino.dispositivo.deposito
    const montoPagado = (termino.plazo - termino.pagosPendientes) * termino.pagoMensual + montoInicial
    return (montoPagado / montoTotal) * 100
  }

  const calcularMontoPagado = () => {
    const montoInicial = termino.dispositivo.deposito
    const montoPagado = (termino.plazo - termino.pagosPendientes) * termino.pagoMensual + montoInicial
    return montoPagado
  }

  const tiempoRestante = calcularTiempoRestante()
  const fechaProximoPago = calcularFechaProximoPago()
  const porcentajeProgreso = calcularPorcentajeProgreso()
  const montoPagado = calcularMontoPagado()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Progreso de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Dispositivo: {termino.dispositivo.marca} {termino.dispositivo.modelo}
          </p>
          <p>Tiempo restante: {tiempoRestante} meses</p>
          <p>Fecha del próximo pago: {fechaProximoPago}</p>
          <p>Monto del próximo pago: ${termino.pagoMensual.toFixed(2)}</p>
          <div className="mt-4">
            <p>Progreso de pago:</p>
            <Progress
              value={porcentajeProgreso}
              className="w-full"
              aria-label={`Progreso de pago: ${porcentajeProgreso.toFixed(0)}%`}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <p>Depósito inicial: ${termino.dispositivo.deposito.toFixed(2)}</p>
              <p>{porcentajeProgreso.toFixed(0)}% completado</p>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">
              Monto pagado: ${montoPagado.toFixed(2)} de ${termino.costoTotal.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={onCerrar} variant="outline">
              Cerrar
            </Button>
            <Button onClick={() => onRealizarPago(termino)}>Realizar Pago</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

