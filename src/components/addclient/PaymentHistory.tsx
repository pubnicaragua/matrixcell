"use client"

import type React from "react"
import { useAuth } from "../../context/AuthContext" // Importar el hook useAuth
import { useState, useMemo } from "react"
import { usePaymentData } from "../../components/payment-history/use-payment-data"
import { SearchFilters } from "../../components/payment-history/search-filters"
import { ActionButtons } from "../../components/payment-history/action-buttons"
import { PaymentTable } from "../../components/payment-history/payment-table"
import { PaymentSummary } from "../../components/payment-history/payment-summary"
import { EditPaymentModal } from "../../components/payment-history/edit-payment-modal"
import type { Payment, EditPaymentData, SortConfig, FilterConfig } from "../../components/payment-history/types"

const PaymentHistoryByStore: React.FC = () => {
  // Usar el contexto de autenticación
  const { userRole, userStore } = useAuth()

  const {
    payments,
    loading,
    error,
    isDeleting,
    getClientName,
    getClientStoreId,
    getStoreName,
    getOperationNumber,
    handleDeletePayment,
    updatePayment,
  } = usePaymentData()

  // Estado para filtros
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: "",
    paymentDate: "",
  })

  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "payment_date",
    direction: "desc",
  })

  // Estado para modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<EditPaymentData | null>(null)

  const handleSort = (field: string) => {
    if (sortConfig.field === field) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      })
    } else {
      setSortConfig({
        field,
        direction: "asc",
      })
    }
  }

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      paymentDate: "",
    })
  }

  const handleEditClick = (payment: Payment) => {
    setCurrentPayment({
      id: payment.id,
      amount_paid: payment.amount_paid,
      receipt_number: payment.receipt_number,
      payment_date: payment.payment_date.split("T")[0],
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (paymentData: EditPaymentData) => {
    const success = await updatePayment(paymentData)
    if (success) {
      setIsEditModalOpen(false)
    }
  }

  // Filtrar pagos según el rol del usuario y términos de búsqueda
  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        // Si es admin (rol_id === 1), ve todos los pagos
        if (userRole === 1) {
          return true
        }
        // Si no es admin, solo ve los pagos de su tienda
        const clientStoreId = getClientStoreId(payment.client_id)
        return clientStoreId === userStore
      })
      .filter((payment) => {
        // Filtrar por fecha de pago
        if (filters.paymentDate) {
          const paymentDate = new Date(payment.payment_date).toISOString().split("T")[0]
          return paymentDate === filters.paymentDate
        }
        return true
      })
      .filter((payment) => {
        // Filtrar por término de búsqueda
        if (!filters.searchTerm) return true

        const searchLower = filters.searchTerm.toLowerCase()
        const clientName = getClientName(payment.client_id).toLowerCase()
        const operationNumber = getOperationNumber(payment.operation_id).toLowerCase()
        const receiptNumber = payment.receipt_number.toLowerCase()
        const storeName = getStoreName(getClientStoreId(payment.client_id) || 0).toLowerCase()

        return (
          clientName.includes(searchLower) ||
          operationNumber.includes(searchLower) ||
          receiptNumber.includes(searchLower) ||
          storeName.includes(searchLower) ||
          payment.amount_paid.toString().includes(searchLower)
        )
      })
      .sort((a, b) => {
        if (sortConfig.field === "payment_date") {
          const dateA = new Date(a.payment_date).getTime()
          const dateB = new Date(b.payment_date).getTime()
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
        } else if (sortConfig.field === "amount_paid") {
          return sortConfig.direction === "asc" ? a.amount_paid - b.amount_paid : b.amount_paid - a.amount_paid
        } else if (sortConfig.field === "amount") {
          return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
        } else if (sortConfig.field === "client_id") {
          const clientA = getClientName(a.client_id).toLowerCase()
          const clientB = getClientName(b.client_id).toLowerCase()
          return sortConfig.direction === "asc" ? clientA.localeCompare(clientB) : clientB.localeCompare(clientA)
        } else if (sortConfig.field === "store_id") {
          const storeA = getStoreName(getClientStoreId(a.client_id) || 0).toLowerCase()
          const storeB = getStoreName(getClientStoreId(b.client_id) || 0).toLowerCase()
          return sortConfig.direction === "asc" ? storeA.localeCompare(storeB) : storeB.localeCompare(storeA)
        }
        return 0
      })
  }, [
    payments,
    userRole,
    userStore,
    filters,
    sortConfig,
    getClientName,
    getOperationNumber,
    getClientStoreId,
    getStoreName,
  ])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Historial de Pagos {userRole !== 1 && userStore && `- ${getStoreName(userStore)}`}
      </h2>

      {/* Componente de búsqueda y filtros */}
      <SearchFilters filters={filters} onFilterChange={setFilters} onResetFilters={resetFilters} />

      {/* Botones de acción */}
      <div className="flex justify-end mb-4">
        <ActionButtons
          filteredPayments={filteredPayments}
          getClientName={getClientName}
          getStoreName={getStoreName}
          getOperationNumber={getOperationNumber}
          getClientStoreId={getClientStoreId}
          userRole={userRole}
          userStore={userStore}
          paymentDate={filters.paymentDate}
        />
      </div>

      {/* Tabla de pagos */}
      <PaymentTable
        payments={filteredPayments}
        sortConfig={sortConfig}
        onSortChange={handleSort}
        getClientName={getClientName}
        getStoreName={getStoreName}
        getOperationNumber={getOperationNumber}
        getClientStoreId={getClientStoreId}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeletePayment}
        isDeleting={isDeleting}
      />

      {/* Resumen de pagos */}
      <PaymentSummary payments={filteredPayments} />

      {/* Modal de edición */}
      <EditPaymentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        payment={currentPayment}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default PaymentHistoryByStore

