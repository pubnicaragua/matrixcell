"use client"

import type React from "react"

import { Download, Printer } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import type { Payment } from "./types"

interface ActionButtonsProps {
  filteredPayments: Payment[]
  getClientName: (clientId: number) => string
  getStoreName: (storeId: number) => string
  getOperationNumber: (operationId: number) => string
  getClientStoreId: (clientId: number) => number | null
  userRole: number
  userStore: number | null
  paymentDate: string // Actualizado de startDate/endDate a paymentDate
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  filteredPayments,
  getClientName,
  getStoreName,
  getOperationNumber,
  getClientStoreId,
  userRole,
  userStore,
  paymentDate,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Historial de Pagos", 14, 20)

    // Información de usuario y filtros
    doc.setFontSize(10)
    let yPos = 30

    // Mostrar tienda si no es admin
    if (userRole !== 1 && userStore) {
      const storeName = getStoreName(userStore)
      doc.text(`Tienda: ${storeName}`, 14, yPos)
      yPos += 6
    }

    if (paymentDate) {
      doc.text(`Fecha de pago: ${format(new Date(paymentDate), "dd/MM/yyyy")}`, 14, yPos)
      yPos += 10
    } else {
      yPos += 4
    }

    // Datos para la tabla
    const tableData = filteredPayments.map((payment) => [
      format(new Date(payment.payment_date), "dd/MM/yyyy"),
      getClientName(payment.client_id),
      getStoreName(getClientStoreId(payment.client_id) || 0),
      getOperationNumber(payment.operation_id),
      payment.receipt_number,
      `$${payment.amount_paid}`,
      `$${payment.amount}`,
    ])

    // Crear tabla
    autoTable(doc, {
      head: [["Fecha", "Cliente", "Tienda", "Operación", "Recibo", "Monto Pagado", "Total Pagado"]],
      body: tableData,
      startY: yPos,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    })

    // Calcular totales
    const totalPaid = filteredPayments.reduce((sum, payment) => sum + payment.amount_paid, 0)
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)

    // Agregar totales al final
    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.text(`Total Pagado: $${totalPaid}`, 14, finalY)
    doc.text(`Total Adeudado: $${totalAmount}`, 14, finalY + 6)

    // Guardar PDF
    doc.save("historial_pagos.pdf")
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar PDF
      </button>

      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
      >
        <Printer className="w-4 h-4 mr-2" />
        Imprimir
      </button>
    </div>
  )
}

