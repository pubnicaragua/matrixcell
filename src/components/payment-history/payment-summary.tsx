"use client"

import type React from "react"

import type { Payment } from "./types"

interface PaymentSummaryProps {
  payments: Payment[]
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ payments }) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-2">Resumen</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Total de pagos</p>
          <p className="text-xl font-bold">{payments.length}</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Total pagado</p>
          <p className="text-xl font-bold text-green-600">
            ${payments.reduce((sum, payment) => sum + payment.amount_paid, 0)}
          </p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">Total adeudado</p>
          <p className="text-xl font-bold text-blue-600">
            ${payments.reduce((sum, payment) => sum + payment.amount, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}

