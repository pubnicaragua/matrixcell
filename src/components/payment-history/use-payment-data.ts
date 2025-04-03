"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import type { Payment, Client, Operation, Store } from "./types"

export const usePaymentData = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [paymentsRes, clientsRes, operationsRes, storesRes] = await Promise.all([
          axios.get("/payments"),
          axios.get("/clients"),
          axios.get("/operations"),
          axios.get("/stores"),
        ])

        setPayments(paymentsRes.data)
        setClients(clientsRes.data)
        setOperations(operationsRes.data)
        setStores(storesRes.data)
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getClientName = useCallback(
    (clientId: number) => {
      const client = clients.find((c) => c.id === clientId)
      return client ? client.name : "Cliente desconocido"
    },
    [clients],
  )

  const getClientStoreId = useCallback(
    (clientId: number) => {
      const client = clients.find((c) => c.id === clientId)
      return client ? client.store_id : null
    },
    [clients],
  )

  const getStoreName = useCallback(
    (storeId: number) => {
      const store = stores.find((s) => s.id === storeId)
      return store ? store.name : "Tienda desconocida"
    },
    [stores],
  )

  const getOperationNumber = useCallback(
    (operationId: number) => {
      const operation = operations.find((o) => o.id === operationId)
      return operation ? operation.operation_number : "Operación desconocida"
    },
    [operations],
  )

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm("¿Está seguro que desea eliminar este pago? Esta acción no se puede deshacer.")) {
      try {
        setIsDeleting(true)
        await axios.delete(`/payments/${paymentId}`)
        setPayments(payments.filter((p) => p.id !== paymentId))
        toast.success("Pago eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar el pago:", error)
        toast.error("Error al eliminar el pago")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getOperationData = (operationId: number): Operation | null => {
    return operations.find(op => op.id === operationId) || null
  }
  

  const updatePayment = async (paymentData: any) => {
    try {
      const response = await axios.put(`/payments/${paymentData.id}`, paymentData)

      // Actualizar el estado de pagos con el pago actualizado
      setPayments(payments.map((p) => (p.id === paymentData.id ? { ...p, ...response.data } : p)))

      toast.success("Pago actualizado correctamente")
      return true
    } catch (error) {
      console.error("Error al actualizar el pago:", error)
      toast.error("Error al actualizar el pago")
      return false
    }
  }

  return {
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
    getOperationData
  }
}

