"use client"

import type React from "react"

import { format } from "date-fns"
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import type { Payment, SortConfig } from "./types"

interface PaymentTableProps {
  payments: Payment[]
  sortConfig: SortConfig
  onSortChange: (field: string) => void
  getClientName: (clientId: number) => string
  getStoreName: (storeId: number) => string
  getOperationNumber: (operationId: number) => string
  getClientStoreId: (clientId: number) => number | null
  onEditClick: (payment: Payment) => void
  onDeleteClick: (paymentId: number) => void
  isDeleting: boolean
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  sortConfig,
  onSortChange,
  getClientName,
  getStoreName,
  getOperationNumber,
  getClientStoreId,
  onEditClick,
  onDeleteClick,
  isDeleting,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => onSortChange("payment_date")}
            >
              <div className="flex items-center">
                Fecha
                {sortConfig.field === "payment_date" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </div>
            </th>
            <th className="py-2 px-4 border cursor-pointer hover:bg-gray-200" onClick={() => onSortChange("client_id")}>
              <div className="flex items-center">
                Cliente
                {sortConfig.field === "client_id" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </div>
            </th>
            <th className="py-2 px-4 border cursor-pointer hover:bg-gray-200" onClick={() => onSortChange("store_id")}>
              <div className="flex items-center">
                Tienda
                {sortConfig.field === "store_id" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </div>
            </th>
            <th className="py-2 px-4 border">Operación</th>
            <th className="py-2 px-4 border">Recibo</th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => onSortChange("amount_paid")}
            >
              <div className="flex items-center">
                Monto Pagado
                {sortConfig.field === "amount_paid" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </div>
            </th>
            <th className="py-2 px-4 border cursor-pointer hover:bg-gray-200" onClick={() => onSortChange("amount")}>
              <div className="flex items-center">
                Total Pagado
                {sortConfig.field === "amount" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
              </div>
            </th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{format(new Date(payment.payment_date), "dd/MM/yyyy")}</td>
                <td className="py-2 px-4 border">{getClientName(payment.client_id)}</td>
                <td className="py-2 px-4 border">{getStoreName(getClientStoreId(payment.client_id) || 0)}</td>
                <td className="py-2 px-4 border">{getOperationNumber(payment.operation_id)}</td>
                <td className="py-2 px-4 border">{payment.receipt_number}</td>
                <td className="py-2 px-4 border text-right">${payment.amount_paid}</td>
                <td className="py-2 px-4 border text-right">${payment.amount}</td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => onEditClick(payment)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Editar pago"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(payment.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Eliminar pago"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-4 text-center text-gray-500">
                No se encontraron pagos con los filtros seleccionados
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan={5} className="py-2 px-4 border text-right">
              Totales:
            </td>
            <td className="py-2 px-4 border text-right">
              ${payments.reduce((sum, payment) => sum + payment.amount_paid, 0)}
            </td>
            <td className="py-2 px-4 border text-right">
              ${payments.reduce((sum, payment) => sum + payment.amount, 0)}
            </td>
            <td className="py-2 px-4 border"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

