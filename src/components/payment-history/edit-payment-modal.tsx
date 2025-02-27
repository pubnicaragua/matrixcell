"use client"

import type React from "react"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import type { EditPaymentData } from "./types"
import { useState, useEffect } from "react"

interface EditPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment: EditPaymentData | null
  onSave: (payment: EditPaymentData) => void
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ isOpen, onClose, payment, onSave }) => {
  const [formData, setFormData] = useState<EditPaymentData | null>(null)

  useEffect(() => {
    if (payment) {
      setFormData(payment)
    }
  }, [payment])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "amount_paid" ? Number.parseFloat(value) : value,
    })
  }

  const handleSave = () => {
    if (formData) {
      onSave(formData)
    }
  }

  if (!formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Editar Pago
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="receipt_number" className="text-right">
              Número de Recibo
            </label>
            <input
              id="receipt_number"
              name="receipt_number"
              value={formData.receipt_number}
              onChange={handleInputChange}
              className="col-span-3 p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount_paid" className="text-right">
              Monto Pagado
            </label>
            <input
              id="amount_paid"
              name="amount_paid"
              type="number"
              step="0.01"
              value={formData.amount_paid}
              onChange={handleInputChange}
              className="col-span-3 p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="payment_date" className="text-right">
              Fecha de Pago
            </label>
            <input
              id="payment_date"
              name="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={handleInputChange}
              className="col-span-3 p-2 border rounded-md"
            />
          </div>
        </div>

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Guardar Cambios
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

