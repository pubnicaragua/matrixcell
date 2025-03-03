import jsPDF from "jspdf"
import "jspdf-autotable"
import type { UserOptions } from "jspdf-autotable"

interface Contract {
  id: number
  nombre_cliente: string | null
  products: {
    article: string
    price: number
  }
  payment_plans: {
    total_cost: number | null
    monthly_payment: number | null
  }
  payment_progress: number | null
  next_payment_date: string
}

// Extend the jsPDF type to include autoTable
interface ExtendedJsPDF extends jsPDF {
  autoTable: (options: UserOptions) => void
  lastAutoTable: { finalY: number } | undefined
}

const PDFVoucher = {
  generate: (contract: Contract) => {
    const doc = new jsPDF() as ExtendedJsPDF

    // Set background color
    doc.setFillColor(240, 240, 240)
    doc.rect(0, 0, 210, 297, "F")

    // Add a modern header
    doc.setFillColor(0, 123, 255)
    doc.rect(0, 0, 210, 40, "F")

    // Add logo (replace with your actual logo)
    const logo = "/assets/logo.jpg"
    doc.addImage(logo, "JPEG", 10, 10, 30, 30)


    // Title
    doc.setFontSize(28)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("Matrixcell", 50, 25)

    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.text("Voucher de Contrato", 50, 35)

    // Contract information
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)

    const paymentProgress = contract.payment_progress || 0
    const totalCost = contract.payment_plans.total_cost || 0
    const amountPaid = (paymentProgress / 100) * totalCost
    const remainingAmount = totalCost - amountPaid

    const data = [
      ["Cliente", contract.nombre_cliente || "No asignado"],
      ["Dispositivo", `${contract.products.article} ${contract.products.price}`],
      ["Monto total", `$${totalCost.toFixed(2)}`],
      ["Pago mensual", `$${contract.payment_plans.monthly_payment?.toFixed(2) || "N/A"}`],
      ["Monto pagado", `$${amountPaid.toFixed(2)}`],
      ["Monto restante", `$${remainingAmount.toFixed(2)}`],
      ["Próxima fecha de pago", new Date(contract.next_payment_date).toLocaleDateString()],
    ]

    doc.autoTable({
      startY: 50,
      head: [["Concepto", "Detalle"]],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255], textColor: 255, fontSize: 14 },
      bodyStyles: { textColor: 60, fontSize: 12 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 50, left: 15, right: 15 },
    })

    // Footer
    doc.setFillColor(0, 123, 255)
    doc.rect(0, 277, 210, 20, "F")

    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`Voucher generado el ${new Date().toLocaleDateString()}`, 105, 290, { align: "center" })

    // Save PDF
    doc.save(`Voucher_Contrato_${contract.id}.pdf`)
  },
}

export default PDFVoucher

