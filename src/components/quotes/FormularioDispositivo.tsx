import { useState, useEffect } from "react"
import type { Dispositivo } from "../../pages/types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { dispositivosPredefinidos, preciosBase } from "../../data/dispositivos"

export function FormularioDispositivo({
  onAgregarDispositivo,
}: {
  onAgregarDispositivo: (dispositivo: Dispositivo) => void
}) {
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [precio, setPrecio] = useState("")
  const [deposito, setDeposito] = useState("")

  useEffect(() => {
    if (modelo) {
      const precioBase = preciosBase[modelo as keyof typeof preciosBase] || 0
      setPrecio(precioBase.toString())
    }
  }, [modelo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const precioNum = Number.parseFloat(precio)
    const depositoNum = Number.parseFloat(deposito)
    const precioConIva = precioNum * 1.12
    onAgregarDispositivo({ marca, modelo, precio: precioConIva, deposito: depositoNum })
    setMarca("")
    setModelo("")
    setPrecio("")
    setDeposito("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Select value={marca} onValueChange={setMarca}>
            <SelectTrigger id="marca">
              <SelectValue placeholder="Selecciona una marca" />
            </SelectTrigger>
            <SelectContent>
              {dispositivosPredefinidos.map((d) => (
                <SelectItem key={d.marca} value={d.marca}>
                  {d.marca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Select value={modelo} onValueChange={setModelo}>
            <SelectTrigger id="modelo">
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {marca &&
                dispositivosPredefinidos
                  .find((d) => d.marca === marca)
                  ?.modelos.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio">Precio</Label>
          <Input
            id="precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deposito">Depósito inicial</Label>
          <Input
            id="deposito"
            type="number"
            value={deposito}
            onChange={(e) => setDeposito(e.target.value)}
            placeholder="Depósito inicial"
            required
          />
        </div>
      </div>
      <Button type="submit">Agregar Dispositivo</Button>
    </form>
  )
}

