"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Mail, Loader2, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import emailjs from "@emailjs/browser"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Client, Operation } from "../../types"

interface SendEmailModalProps {
    isOpen: boolean
    onClose: () => void
    client: Client
    operation: Operation
    storeName: string
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, client, operation, storeName }) => {
    const [isSending, setIsSending] = useState(false)
    const [emailStatus, setEmailStatus] = useState<{
        type: "success" | "error" | null
        message: string | null
    }>({ type: null, message: null })

    const generatePDF = (): string => {
        const doc = new jsPDF()

        // Título y encabezado
        doc.setFontSize(18)
        doc.text("Factura", 14, 20)

        doc.setFontSize(12)
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30)
        doc.text(`Tienda: ${storeName}`, 14, 38)

        // Datos del cliente
        doc.setFontSize(14)
        doc.text("Datos del Cliente", 14, 50)
        doc.setFontSize(12)
        doc.text(`Nombre: ${client.name}`, 14, 58)
        doc.text(`Cédula: ${client.identity_number}`, 14, 66)
        doc.text(`Dirección: ${client.address || "No disponible"}`, 14, 74)
        doc.text(`Ciudad: ${client.city || "No disponible"}`, 14, 82)
        doc.text(`Teléfono: ${client.phone || "No disponible"}`, 14, 90)

        // Detalles de la operación
        doc.setFontSize(14)
        doc.text("Detalles de la Operación", 14, 105)

        autoTable(doc, {
            startY: 110,
            head: [["Concepto", "Valor"]],
            body: [
                ["Número de Operación", operation.operation_number],
                ["Valor de Operación", `$${operation.operation_value.toFixed(2)}`],
                ["Valor por Vencer", `$${operation.amount_due.toFixed(2)}`],
                ["Valor Vencido", `$${operation.amount_paid.toFixed(2)}`],
                ["Días Vencidos", operation.days_overdue.toString()],
                ["Fecha de Vencimiento", new Date(operation.due_date).toLocaleDateString()],
                ["Próximo Vencimiento", new Date(operation.prox_due_date).toLocaleDateString()],
            ],
            theme: "striped",
            headStyles: { fillColor: [66, 139, 202] },
        })

        // Pie de página
        const finalY = (doc as any).lastAutoTable.finalY + 20
        doc.text("Gracias por su preferencia", 14, finalY)

        // Convertir a base64
        return doc.output("dataurlstring")
    }

    const handleSendEmail = async () => {
        if (!client.email) {
            setEmailStatus({ type: "error", message: "El cliente no tiene un correo electrónico registrado." })
            return
        }

        try {
            setIsSending(true)
            setEmailStatus({ type: null, message: null })

            // Generar PDF
            const pdfDataUrl = generatePDF()

            // Preparar datos para EmailJS
            const templateParams = {
                to_email: client.email,
                to_name: client.name,
                client_id: client.identity_number,
                operation_number: operation.operation_number,
                operation_value: operation.operation_value.toFixed(2),
                amount_due: operation.amount_due.toFixed(2),
                amount_paid: operation.amount_paid.toFixed(2),
                days_overdue: operation.days_overdue,
                due_date: new Date(operation.due_date).toLocaleDateString(),
                next_due_date: new Date(operation.prox_due_date).toLocaleDateString(),
                store_name: storeName,
                pdf_data: pdfDataUrl,
            }

            // Enviar correo con EmailJS
            await emailjs.send(
                "service_uogs8m7",
                "template_nzmmvog", // Asegúrate de crear esta plantilla en EmailJS
                templateParams,
                "1OwUVaEkz3b7pYLxX",
            )


            setEmailStatus({
                type: "success",
                message: "Factura enviada exitosamente a " + client.email,
            })
        } catch (error) {
            console.error("Error al enviar el correo:", error)
            setEmailStatus({
                type: "error",
                message: error instanceof Error ? error.message : "Error al enviar el correo",
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enviar Factura - {client.name}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-4">
                    <div className="mt-4 text-center">
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">Cédula: {client.identity_number}</p>
                        <p className="text-sm text-gray-500">Operación: {operation.operation_number}</p>
                        {client.email && <p className="text-sm text-gray-500">Email: {client.email}</p>}
                        <p className="mt-4 text-sm">
                            Se enviará un correo electrónico con los detalles de la factura en formato PDF.
                            
                        </p>
                    </div>
                </div>

                {emailStatus.type && (
                    <Alert className={emailStatus.type === "success" ? "bg-green-50" : "bg-red-50"}>
                        {emailStatus.type === "success" ? (
                            <Check className="h-4 w-4 text-green-600" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={emailStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                            {emailStatus.message}
                        </AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                    {client.email && (
                        <Button
                            onClick={handleSendEmail}
                            disabled={isSending}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Enviar factura
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SendEmailModal

