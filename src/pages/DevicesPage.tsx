"use client"

import { useState } from "react"
import { DispositivosLista } from "../components/devices/dispositivos-lista"
import { CargaMasiva } from "../components/devices/carga-masiva"

type Dispositivo = {
  id: string
  tipo: "Laptop" | "TV"
  estado: "Bloqueado" | "Desbloqueado"
  cliente: string
  numeroSerie: string
  mac: string
  codigoDesbloqueo: string
}

export default function Home() {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])

  const handleDataLoaded = (newData: Dispositivo[]) => {
    setDispositivos(newData)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Dispositivos</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Carga Masiva de Dispositivos</h2>
        <CargaMasiva onDataLoaded={handleDataLoaded} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Formato del Archivo de Carga Masiva</h2>
        <p className="mb-2">El archivo Excel debe contener las siguientes columnas:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>tipo</strong>: "Laptop" o "TV"
          </li>
          <li>
            <strong>numeroSerie</strong>: Número de serie único del dispositivo
          </li>
          <li>
            <strong>mac</strong>: Dirección MAC del dispositivo
          </li>
          <li>
            <strong>estado</strong>: "Bloqueado" o "Desbloqueado"
          </li>
          <li>
            <strong>cliente</strong>: Nombre del cliente asociado al dispositivo
          </li>
          <li>
            <strong>codigoDesbloqueo</strong>: Código único para desbloquear el dispositivo
          </li>
        </ul>
        <p>
          Asegúrese de que todas las columnas estén presentes y correctamente formateadas en su archivo antes de
          cargarlo.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Listado de Dispositivos</h2>
        <DispositivosLista dispositivos={dispositivos} onDispositivosChange={setDispositivos} />
      </div>
    </div>
  )
}

