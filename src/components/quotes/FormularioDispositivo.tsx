"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { PlusCircle, X } from "lucide-react"

interface Device {
  id: number
  marca: string
  modelo: string
  price: number
}

interface FormularioDispositivoProps {
  onDeviceSelect: (device: { id: number; price: number }) => void
}

const DeviceSelector: React.FC<FormularioDispositivoProps> = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
  const [newDevice, setNewDevice] = useState({ marca: "", modelo: "", price: "" })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await axios.get("/devices")
      console.log("desde devices", response.data)
      // Filter devices to only include those with a brand
      const filteredDevices = response.data.filter((device: Device) => device.modelo && device.modelo.trim() !== "")
      setDevices(filteredDevices)
    } catch (error) {
      console.error("Error fetching devices:", error)
    }
  }

  const handleSelectDevice = (id: string) => {
    const device = devices.find((d) => d.id === Number.parseInt(id))
    if (device) {
      onDeviceSelect({ id: device.id, price: device.price })
      setSelectedDeviceId(device.id)
    }
  }

  const handleNewDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDevice({ ...newDevice, [name]: value })
  }

  const handleAddDevice = async () => {
    const { marca, modelo, price } = newDevice
    if (!marca || !modelo || !price) {
      alert("Por favor, complete todos los campos.")
      return
    }

    try {
      const response = await axios.post("/devices", {
        marca,
        modelo,
        price: Number.parseFloat(price),
      })

      setDevices([...devices, response.data])
      setNewDevice({ marca: "", modelo: "", price: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding new device:", error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Selecciona un Dispositivo</CardTitle>
        <CardDescription>Elige un dispositivo existente o agrega uno nuevo</CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSelectDevice} value={selectedDeviceId?.toString() || ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un dispositivo" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.id} value={device.id.toString()}>
                {device.marca ? device.marca : 'Verificar Marca' } - {device.modelo} ({device.price ? `$${device.price}` : "Verificar precio"})
              </SelectItem>
            ))}
          </SelectContent>

        </Select>

        {!selectedDeviceId && (
          <div className="mt-4">
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" className="w-full">
              {showAddForm ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Agregar Nuevo
                </>
              )}
            </Button>

            {showAddForm && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Agregar Nuevo Dispositivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        name="marca"
                        placeholder="Marca"
                        value={newDevice.marca}
                        onChange={handleNewDeviceChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input
                        id="modelo"
                        name="modelo"
                        placeholder="Modelo"
                        value={newDevice.modelo}
                        onChange={handleNewDeviceChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Precio"
                        value={newDevice.price}
                        onChange={handleNewDeviceChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddDevice} className="w-full">
                    Agregar Dispositivo
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DeviceSelector

