import type { Dispositivo } from "../../pages/types"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export function ListaDispositivos({
  dispositivos,
  onFirmarContrato,
}: {
  dispositivos: Dispositivo[]
  onFirmarContrato: (dispositivo: Dispositivo) => void
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Dispositivos Guardados</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {dispositivos.map((dispositivo, index) => (
            <li key={index}>
              <Card>
                <CardContent className="p-4">
                  <p>Marca: {dispositivo.marca}</p>
                  <p>Modelo: {dispositivo.modelo}</p>
                  <p>Precio + IVA: ${dispositivo.precio.toFixed(2)}</p>
                  <p>Depósito: ${dispositivo.deposito.toFixed(2)}</p>
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

