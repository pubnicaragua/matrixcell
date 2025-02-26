"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import axios from "../../axiosConfig"
import { format } from "date-fns"
import { Search, ChevronDown, ChevronUp, Download, Printer } from 'lucide-react'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Payment {
  id: number
  client_id: number
  operation_id: number
  amount_paid: number
  amount: number
  receipt_number: string
  payment_date: string
  created_at: string
}

interface Client {
  id: number
  name: string
  email: string
  phone: string
  store_id: number
}

interface Operation {
  id: number
  operation_number: string
  client_id: number
}

interface Store {
  id: number
  name: string
}

const PaymentHistoryByStore: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [operations, setOperations] = useState<Operation[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [sortField, setSortField] = useState<string>("payment_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState<string>("")
  
  // Usuario actual
  const [userRole, setUserRole] = useState<number>(0)
  const [userStore, setUserStore] = useState<number | null>(null)

  useEffect(() => {
    // Obtener información del usuario desde localStorage
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      try {
        const parsedPerfil = JSON.parse(perfil)
        setUserRole(parsedPerfil.rol_id || 0)
        setUserStore(parsedPerfil.store_id || null)
      } catch (error) {
        console.error("Error al obtener información del usuario:", error)
      }
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const [paymentsRes, clientsRes, operationsRes, storesRes] = await Promise.all([
          axios.get("/payments"),
          axios.get("/clients"),
          axios.get("/operations"),
          axios.get("/stores")
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

  const getClientName = useCallback((clientId: number) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : "Cliente desconocido"
  }, [clients])

  const getClientStoreId = useCallback((clientId: number) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.store_id : null
  }, [clients])

  const getStoreName = useCallback((storeId: number) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : "Tienda desconocida"
  }, [stores])

  const getOperationNumber = useCallback((operationId: number) => {
    const operation = operations.find(o => o.id === operationId)
    return operation ? operation.operation_number : "Operación desconocida"
  }, [operations])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filtrar pagos según el rol del usuario y términos de búsqueda
  const filteredPayments = useMemo(() => {
    return payments
      .filter(payment => {
        // Filtrar por tienda según el rol
        if (userRole === 1) {
          // Si es admin, ve todos los pagos
          return true
        } else {
          // Si no es admin, solo ve los pagos de clientes de su tienda
          const clientStoreId = getClientStoreId(payment.client_id)
          return clientStoreId === userStore
        }
      })
      .filter(payment => {
        // Filtrar por rango de fechas
        if (startDate && endDate) {
          const paymentDate = new Date(payment.payment_date)
          const start = new Date(startDate)
          const end = new Date(endDate)
          end.setHours(23, 59, 59) // Incluir todo el día final
          return paymentDate >= start && paymentDate <= end
        } else if (startDate) {
          const paymentDate = new Date(payment.payment_date)
          const start = new Date(startDate)
          return paymentDate >= start
        } else if (endDate) {
          const paymentDate = new Date(payment.payment_date)
          const end = new Date(endDate)
          end.setHours(23, 59, 59) // Incluir todo el día final
          return paymentDate <= end
        }
        return true
      })
      .filter(payment => {
        // Filtrar por término de búsqueda
        if (!searchTerm) return true
        
        const searchLower = searchTerm.toLowerCase()
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
        if (sortField === "payment_date") {
          const dateA = new Date(a.payment_date).getTime()
          const dateB = new Date(b.payment_date).getTime()
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA
        } else if (sortField === "amount_paid") {
          return sortDirection === "asc" 
            ? a.amount_paid - b.amount_paid 
            : b.amount_paid - a.amount_paid
        } else if (sortField === "amount") {
          return sortDirection === "asc" 
            ? a.amount - b.amount 
            : b.amount - a.amount
        } else if (sortField === "client_id") {
          const clientA = getClientName(a.client_id).toLowerCase()
          const clientB = getClientName(b.client_id).toLowerCase()
          return sortDirection === "asc" 
            ? clientA.localeCompare(clientB) 
            : clientB.localeCompare(clientA)
        } else if (sortField === "store_id") {
          const storeA = getStoreName(getClientStoreId(a.client_id) || 0).toLowerCase()
          const storeB = getStoreName(getClientStoreId(b.client_id) || 0).toLowerCase()
          return sortDirection === "asc" 
            ? storeA.localeCompare(storeB) 
            : storeB.localeCompare(storeA)
        }
        return 0
      })
  }, [payments, userRole, userStore, searchTerm, startDate, endDate, sortField, sortDirection, getClientName, getOperationNumber, getClientStoreId, getStoreName])

  const resetFilters = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
  }

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
    
    if (startDate || endDate) {
      const dateRange = `Período: ${startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'Inicio'} - ${endDate ? format(new Date(endDate), 'dd/MM/yyyy') : 'Actualidad'}`
      doc.text(dateRange, 14, yPos)
      yPos += 10
    } else {
      yPos += 4
    }
    
    // Datos para la tabla
    const tableData = filteredPayments.map(payment => [
      format(new Date(payment.payment_date), 'dd/MM/yyyy'),
      getClientName(payment.client_id),
      getStoreName(getClientStoreId(payment.client_id) || 0),
      getOperationNumber(payment.operation_id),
      payment.receipt_number,
      `$${payment.amount_paid}`,
      `$${payment.amount}`
    ])
    
    // Crear tabla
    autoTable(doc, {
      head: [['Fecha', 'Cliente', 'Tienda', 'Operación', 'Recibo', 'Monto Pagado', 'Total Pagado']],
      body: tableData,
      startY: yPos,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }
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
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Buscador */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente, operación, recibo o tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filtros de fecha */}
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Fecha inicio"
              className="p-2 border rounded-md"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Fecha fin"
              className="p-2 border rounded-md"
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-wrap justify-between">
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Limpiar Filtros
          </button>
          
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
        </div>
      </div>
      
      {/* Tabla de pagos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("payment_date")}
              >
                <div className="flex items-center">
                  Fecha
                  {sortField === "payment_date" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("client_id")}
              >
                <div className="flex items-center">
                  Cliente
                  {sortField === "client_id" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("store_id")}
              >
                <div className="flex items-center">
                  Tienda
                  {sortField === "store_id" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="py-2 px-4 border">Operación</th>
              <th className="py-2 px-4 border">Recibo</th>
              <th 
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("amount_paid")}
              >
                <div className="flex items-center">
                  Monto Pagado
                  {sortField === "amount_paid" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Total Pagado
                  {sortField === "amount" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {format(new Date(payment.payment_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-2 px-4 border">{getClientName(payment.client_id)}</td>
                  <td className="py-2 px-4 border">{getStoreName(getClientStoreId(payment.client_id) || 0)}</td>
                  <td className="py-2 px-4 border">{getOperationNumber(payment.operation_id)}</td>
                  <td className="py-2 px-4 border">{payment.receipt_number}</td>
                  <td className="py-2 px-4 border text-right">${payment.amount_paid}</td>
                  <td className="py-2 px-4 border text-right">${payment.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No se encontraron pagos con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td colSpan={5} className="py-2 px-4 border text-right">Totales:</td>
              <td className="py-2 px-4 border text-right">
                ${filteredPayments.reduce((sum, payment) => sum + payment.amount_paid, 0)}
              </td>
              <td className="py-2 px-4 border text-right">
                ${filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Resumen */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium mb-2">Resumen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total de pagos</p>
            <p className="text-xl font-bold">{filteredPayments.length}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total pagado</p>
            <p className="text-xl font-bold text-green-600">
              ${filteredPayments.reduce((sum, payment) => sum + payment.amount_paid, 0)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total adeudado</p>
            <p className="text-xl font-bold text-blue-600">
              ${filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentHistoryByStore
