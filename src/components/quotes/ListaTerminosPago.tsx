import type { TerminoPago } from "../../pages/types"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export function ListaTerminosPago({
  terminosPago,
  onMostrarProgreso,
}: {
  terminosPago: TerminoPago[]
  onMostrarProgreso: (termino: TerminoPago) => void
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Contratos Firmados</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {terminosPago.map((termino, index) => (
            <li key={index}>
              <Card>
                <CardContent className="p-4">
                  <p>Marca: {termino.dispositivo.marca}</p>
                  <p>Modelo: {termino.dispositivo.modelo}</p>
                  <p>Plazo: {termino.plazo} meses</p>
                  <p>Pago Mensual: ${termino.pagoMensual.toFixed(2)}</p>
                  <p>Pago Semanal: ${termino.pagoSemanal.toFixed(2)}</p>
                  <p>Costo Total: ${termino.costoTotal.toFixed(2)}</p>
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

