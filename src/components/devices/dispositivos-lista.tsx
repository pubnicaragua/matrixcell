"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Lock, Unlock, Copy } from "lucide-react"

type Dispositivo = {
  id: string
  tipo: "Laptop" | "TV"
  estado: "Bloqueado" | "Desbloqueado"
  cliente: string
  numeroSerie: string
  mac: string
  codigoDesbloqueo: string
}

interface DispositivosListaProps {
  dispositivos: Dispositivo[]
  onDispositivosChange: (dispositivos: Dispositivo[]) => void
}

export function DispositivosLista({ dispositivos, onDispositivosChange }: DispositivosListaProps) {
  const [filtro, setFiltro] = useState("")

  const toggleEstado = (id: string) => {
    const nuevosDispositivos = dispositivos.map((d): Dispositivo => {
      if (d.id === id) {
        const nuevoEstado: "Bloqueado" | "Desbloqueado" = d.estado === "Bloqueado" ? "Desbloqueado" : "Bloqueado"
        return { ...d, estado: nuevoEstado }
      }
      return d
    })
    onDispositivosChange(nuevosDispositivos)
  }

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard
      .writeText(codigo)
      .then(() => {
        console.log("Código copiado al portapapeles")
      })
      .catch((err) => {
        console.error("Error al copiar el código", err)
      })
  }

  const dispositivosFiltrados = dispositivos.filter(
    (d) =>
      d.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      d.numeroSerie.toLowerCase().includes(filtro.toLowerCase()) ||
      d.mac.toLowerCase().includes(filtro.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filtrar por cliente, número de serie o MAC"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Número de Serie</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Código de Desbloqueo</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispositivosFiltrados.map((dispositivo) => (
            <TableRow key={dispositivo.id}>
              <TableCell>{dispositivo.tipo}</TableCell>
              <TableCell>{dispositivo.numeroSerie}</TableCell>
              <TableCell>{dispositivo.mac}</TableCell>
              <TableCell>{dispositivo.estado}</TableCell>
              <TableCell>{dispositivo.cliente}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{dispositivo.codigoDesbloqueo}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copiarCodigo(dispositivo.codigoDesbloqueo)}
                    title="Copiar código"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="icon" onClick={() => toggleEstado(dispositivo.id)}>
                  {dispositivo.estado === "Bloqueado" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

