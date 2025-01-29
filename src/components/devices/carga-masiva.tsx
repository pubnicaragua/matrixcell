"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Upload, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import * as XLSX from "xlsx"

type Dispositivo = {
  id: string
  tipo: "Laptop" | "TV"
  estado: "Bloqueado" | "Desbloqueado"
  cliente: string
  numeroSerie: string
  mac: string
  codigoDesbloqueo: string
}

interface CargaMasivaProps {
  onDataLoaded: (data: Dispositivo[]) => void
}

export function CargaMasiva({ onDataLoaded }: CargaMasivaProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Dispositivo[]

        // Asignar IDs únicos a cada dispositivo
        const dispositivosConId = jsonData.map((dispositivo, index) => ({
          ...dispositivo,
          id: `${index + 1}`,
        }))

        onDataLoaded(dispositivosConId)
      }
      reader.readAsArrayBuffer(file)
      setFile(null)
    }
  }

  const columnasRequeridas = ["tipo", "numeroSerie", "mac", "estado", "cliente", "codigoDesbloqueo"]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file}>
          <Upload className="mr-2 h-4 w-4" /> Cargar
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>El archivo debe contener las siguientes columnas:</p>
              <ul className="list-disc list-inside">
                {columnasRequeridas.map((columna) => (
                  <li key={columna}>{columna}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm text-gray-500">
        <p>El archivo Excel debe contener las siguientes columnas:</p>
        <ul className="list-disc list-inside">
          {columnasRequeridas.map((columna) => (
            <li key={columna}>{columna}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

