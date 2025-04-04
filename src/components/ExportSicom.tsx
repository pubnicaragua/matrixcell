"use client"

import type React from "react"
import { useState } from "react"
import api from "../axiosConfig"
import * as XLSX from "xlsx"
import Loader from "./ui/loader"

const ExportEquifax: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [fileName, setFileName] = useState("macro_sicom_export.xlsx")
  const [isLoading, setIsLoading] = useState(false)
  const columns = [
    "COD_TIPO_ID",
    "CODIGO_ID_SUJETO",
    "NOMBRE_SUJETO",
    "DIRECCION",
    "CIUDAD",
    "TELEFONO",
    "FEC_CORTE_SALDO",
    "TIPO_DEUDOR",
    //"NUMERO DE OPERACIÓN",
    "FECHA_CONCESION",
    "VAL_OPERACION",
    "VAL_A_VENCER",
    "VAL_VENCIDO",
    "VA_DEM_JUDICIAL",
    "VAL_CART_CASTIGADA",
    "NUM_DIAS_VENCIDOS",
    "FECHA_DE_VENCIMIENTO",
    "DEUDA_REFINANCIADA",
    "FECHA_SIG_VENCIMIENTO",
    //"PLAZO_EN_MESES",
    "VALOR_MENSUAL",
    "FRECUENCIA_PAGO",
  ]

  const generateUniqueCode = (cedula: string): string => {
    const lastFiveDigits = cedula.slice(-5)
    const randomLetters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    ).join("")
    return `${lastFiveDigits}${randomLetters}`
  }

  const calculateFields = (client: any) => {
    const valOperacion = Number.parseFloat(client["VAL_OPERACION"]?.replace(/,/g, "")) || 0
    const valAVencer = Number.parseFloat(client["VAL_A_VENCER"]?.replace(/,/g, "")) || valOperacion

    // Valor vencido igual al valor a vencer si no existe
    const valVencido = client["VAL_VENCIDO"] ? Number.parseFloat(client["VAL_VENCIDO"]?.replace(/,/g, "")) : valAVencer

    let creditTerm = 0
    const creditTermStr = client["PLAZO_EN_MESES"]?.toString().toUpperCase() || ""
    if (creditTermStr) {
      creditTerm = Number.parseInt(creditTermStr.replace(/\D/g, ""), 10) || 0
    }

    const paymentFrequency = "MENSUAL"

    const startDate = new Date(client["FECHA_CONCESION"])
    if (isNaN(startDate.getTime())) {
      return {
        ...client,
        FEC_CORTE_SALDO: getLastDayOfCurrentMonth(),
        FRECUENCIA_PAGO: "MENSUAL",
        FECHA_DE_VENCIMIENTO: "N/A",
        FECHA_SIG_VENCIMIENTO: "N/A",
      }
    }

    const firstDueDate = new Date(client["FECHA_DE_VENCIMIENTO"]) || new Date(startDate)
    if (!isNaN(firstDueDate.getTime())) {
      firstDueDate.setMonth(firstDueDate.getMonth() + 1)
    } else {
      firstDueDate.setMonth(startDate.getMonth() + 1)
    }

    // Fecha de siguiente vencimiento = un mes después de la fecha de vencimiento
    const nextDueDate = new Date(client["FECHA_DE_VENCIMIENTO"])
    if (!isNaN(nextDueDate.getTime())) {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    } else {
      nextDueDate.setMonth(startDate.getMonth() + 2)
    }

    const today = new Date()
    const dueDate = new Date(client["FECHA_DE_VENCIMIENTO"]) || firstDueDate
    const daysOverdue = today > dueDate ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0

    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"])

    function getLastDayOfCurrentMonth() {
      const today = new Date()
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      const lastDayOfMonth = new Date(nextMonth.getTime() - 1)
      return lastDayOfMonth.toISOString().split("T")[0]
    }

    // Usar la fecha de corte del documento o el último día del mes actual
    const cutoffDate = client["FEC_CORTE_SALDO"] || getLastDayOfCurrentMonth()

    return {
      ...client,
      NUMERO_DE_OPERACION: operationNumber,
      VAL_A_VENCER: valAVencer.toFixed(2),
      VAL_VENCIDO: valVencido.toFixed(2),
      NUM_DIAS_VENCIDOS: `${daysOverdue} días`,
      FEC_CORTE_SALDO: cutoffDate,
      FRECUENCIA_PAGO: paymentFrequency,
      PLAZO_EN_MESES: creditTerm ? ` ${creditTerm} meses` : client["PLAZO_EN_MESES"] || "",
      FECHA_DE_VENCIMIENTO: client["FECHA_DE_VENCIMIENTO"] || firstDueDate.toISOString().split("T")[0],
      FECHA_SIG_VENCIMIENTO: nextDueDate.toISOString().split("T")[0],
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const binaryStr = e.target?.result as string
        const workbook = XLSX.read(binaryStr, { type: "binary" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })

        const formattedData = jsonData.map((row: any) => {
          const newRow: Record<string, any> = {}
          columns.forEach((col) => {
            newRow[col] = row[col] || ""
          })
          return calculateFields(newRow)
        })

        setData(formattedData)
      } catch (error) {
        alert(`Error al procesar el archivo: ${(error as Error).message}`)
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleExport = () => {
    if (!data.length) {
      alert("No hay datos para exportar.")
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Exportados")

    XLSX.writeFile(workbook, fileName)
  }
  const handleSend = async () => {
    if (!data.length) {
      alert("No hay datos para enviar.")
      return
    }

    setIsLoading(true)

    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Exportados")

      const excelFile = XLSX.write(workbook, { type: "array", bookType: "xlsx" })

      const formData = new FormData()
      formData.append(
        "file",
        new Blob([excelFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        fileName,
      )

      await api.post("/clients/insercion-consolidado", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Archivo enviado exitosamente.")
    } catch (error) {
      alert(`Error al enviar el archivo: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Macro Sicom</h2>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload">Cargar archivo Excel:</label>
        <input id="fileUpload" type="file" accept=".xlsm, .xlsx" onChange={handleFileUpload} />
      </div>

      <div>
        <label htmlFor="fileName">Nombre del archivo a exportar:</label>
        <input id="fileName" type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        <button onClick={handleExport} style={{ marginLeft: "10px" }}>
          Exportar a Excel
        </button>
        <button onClick={handleSend} style={{ marginLeft: "10px" }} disabled={isLoading}>
          {isLoading ? (
            <>
              "Enviando..."
              <Loader />
            </>
          ) : (
            "Enviar Consolidado"
          )}
        </button>
      </div>

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "5px" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>¿Cómo cargar el archivo?</h3>
        <p>
          Asegúrese de cargar el archivo en formato <strong>.xlsx</strong> con las siguientes columnas:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
          {[
            "COD_TIPO_ID",
            "CODIGO_ID_SUJETO",
            "NOMBRE_SUJETO",
            "DIRECCION",
            "CIUDAD",
            "TELEFONO",
            "FEC_CORTE_SALDO",
            "TIPO_DEUDOR",
            "FECHA_CONCESION",
            "VAL_OPERACION",
            "VAL_A_VENCER",
            "VAL_VENCIDO",
            "VA_DEM_JUDICIAL",
            "VAL_CART_CASTIGADA",
            "NUM_DIAS_VENCIDOS",
            "FECHA_DE_VENCIMIENTO",
            "DEUDA_REFINANCIADA",
            "FECHA_SIG_VENCIMIENTO",
            "PLAZO_EN_MESES",
            "VALOR_MENSUAL",
          ].map((col) => (
            <li key={col}>{col}</li>
          ))}
        </ul>
        <p>El sistema calculará automáticamente los campos faltantes y procesará el reporte.</p>
      </div>
    </div>
  )
}

export default ExportEquifax

