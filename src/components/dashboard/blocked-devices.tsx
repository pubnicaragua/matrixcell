import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Lock } from 'lucide-react'

interface Device {
  id: number
  imei: string
  status: string
}

interface BlockedDevicesProps {
  devices: Device[]
}

export function BlockedDevices({ devices }: BlockedDevicesProps) {
  const blockedDevices = devices.filter(device => device.status === 'Bloqueado')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Dispositivos Bloqueados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {blockedDevices.length > 0 ? (
          <ul className="space-y-2">
            {blockedDevices.map(device => (
              <li key={device.id} className="flex items-center gap-2 text-sm">
                <span className="font-medium">IMEI:</span> {device.imei}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No hay dispositivos bloqueados.</p>
        )}
      </CardContent>
    </Card>
  )
}

