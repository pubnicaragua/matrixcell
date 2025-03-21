"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Pagination from "../Pagination"
import type { Operation, Client, Store } from "../../types"
import axios from "../../axiosConfig"

interface OperationListProps {
  operations: Operation[]
  clients: Client[]
  stores: Store[]
  setSelectedOperation: (operation: Operation) => void
  deleteOperation: (id: number) => void
}

const OperationList: React.FC<OperationListProps> = ({
  operations,
  clients,
  stores,
  setSelectedOperation,
  deleteOperation,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [activeClients, setActiveClients] = useState<Client[]>([])
  const [userRole, setUserRole] = useState<number>(0)
  const [userStore, setUserStore] = useState<number | null>(null)

  useEffect(() => {
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
      setUserStore(parsedPerfil.store_id || null)
    }
  }, [])

  useEffect(() => {
    const nonDeletedClients = clients.filter((client) => !client.deleted)
    setActiveClients(nonDeletedClients)
  }, [clients])

  const getClientName = (clientId: number) => {
    const client = activeClients.find((client) => client.id === clientId)
    return client ? client.name : "Desconocido"
  }

  const getStoreName = (clientId: number) => {
    const client = activeClients.find((client) => client.id === clientId)
    if (!client || !client.store_id) return "No asignado"
    const store = stores.find((store) => store.id === client.store_id)
    return store ? store.name : "Desconocido"
  }

  const getClientEmail = (clientId: number) => {
    const client = activeClients.find((client) => client.id === clientId)
    return client ? client.email : "Desconocido"
  }

  const filteredOperations = useMemo(() => {
    return operations
      .filter((operation) => {
        const client = activeClients.find((c) => c.id === operation.client_id)
        if (!client) return false // Excluir operaciones de clientes eliminados

        // ✅ Si el usuario es admin, ve todas las operaciones
        if (userRole === 1) return true

        // ✅ Si el usuario NO es admin, solo ve operaciones de clientes de su tienda
        return client.store_id === userStore
      })
      .filter((operation) => {
        const operationNumber = operation.operation_number?.toLowerCase() || ""
        const clientName = clients.find((c) => c.id === operation.client_id)?.name?.toLowerCase() || ""
        return operationNumber.includes(searchTerm.toLowerCase()) || clientName.includes(searchTerm.toLowerCase())
      })
  }, [operations, activeClients, clients, userRole, userStore, searchTerm])

  const createInvoice = async (operation: Operation) => {
    try {
      const client = activeClients.find((c) => c.id === operation.client_id)
      if (!client) {
        alert("Cliente no encontrado.")
        return
      }

      const invoiceData = {
        amount: operation.amount_due,
        client_name: client.name,
        operation_id: operation.id,
        store_id: userStore, // Agregar el store_id del usuario autenticado
      }

      await axios.post("/invoices", invoiceData)
      alert("Factura generada correctamente.")
    } catch (error) {
      alert("Error al crear la factura.")
      console.error(error)
    }
  }

  const paginatedOperations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredOperations.slice(startIndex, endIndex)
  }, [filteredOperations, currentPage])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reiniciar a la primera página
  }

  const handleGeneratePdf = async (operation: Operation) => {
    await createInvoice(operation)
    generatePdf(operation.client_id)
  }

  const generatePdf = (clientId: number) => {
    const client = activeClients.find((client) => client.id === clientId)
    if (!client) return

    const clientOperations = operations.filter((op) => op.client_id === clientId)

    const doc = new jsPDF()
    doc.text(`Factura - ${client.name}`, 14, 20)

    const tableData = clientOperations.map((operation) => [
      operation.operation_number,
      operation.operation_value.toFixed(2),
      operation.due_date,
      operation.prox_due_date,
      operation.amount_due.toFixed(2),
      operation.amount_paid.toFixed(2),
      operation.days_overdue,
      operation.cart_value.toFixed(2),
      Number(operation.refinanced_debt) || 0,
      operation.judicial_action ? "Sí" : "No",
    ])

    autoTable(doc, {
      head: [
        [
          "Número",
          "Valor",
          "Fecha Venc.",
          "Próx. Venc.",
          "Monto Pagado",
          "Monto por Vencer",
          "Días Vencidos",
          "Valor Castigado",
          "Deuda Refinanciada",
          "Acción Judicial",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    })

    doc.save(`reporte_${client.name}.pdf`)
  }

  const sendWhatsApp = (clientId: number) => {
    const client = activeClients.find((client) => client.id === clientId)
    if (!client) return

    const phone = client.phone.replace(/\D/g, "")
    const message = encodeURIComponent(`Hola ${client.name}, aquí está el reporte de sus operaciones.`)

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const allOperations = operations

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Lista de Operaciones</h2>

      <div className="py-2">
        <h2>Total de operaciones por cliente: {filteredOperations.length}</h2>
      </div>

      <input
        type="text"
        placeholder="Buscar por número de operación o nombre del cliente"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-6 p-2 w-full border rounded-lg"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {paginatedOperations.map((operation) => (
          <div
            key={operation.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-2">Operación #{operation.operation_number}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Valor:</strong> {operation.operation_value}
              </p>
              <p>
                <strong>Fecha de Vencimiento:</strong> {operation.due_date}
              </p>
              <p>
                <strong>Próximo Vencimiento:</strong> {operation.prox_due_date}
              </p>
              <p>
                <strong>Monto Pagado: </strong> {operation.amount_due}
              </p>
              <p>
                <strong>Monto por Vencer:</strong> {operation.amount_paid}
              </p>
              <p>
                <strong>Días Vencidos:</strong> {operation.days_overdue}
              </p>
              <p>
                <strong>Valor Castigado:</strong> {operation.cart_value}
              </p>
              <p>
                <strong>Deuda Refinanciada:</strong> {operation.refinanced_debt}
              </p>
              <p>
                <strong>Acción Judicial:</strong> {operation.judicial_action}
              </p>
              <p>
                <strong>Cliente:</strong> {getClientName(operation.client_id)}
              </p>
              <p>
                <strong>Email:</strong> {getClientEmail(operation.client_id)}
              </p>
              <p>
                <strong>Tienda:</strong> {getStoreName(operation.client_id)}
              </p>
            </div>

            <div className="mt-4 flex justify-between space-x-2">
              <button
                onClick={() => setSelectedOperation(operation)}
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => operation.id && deleteOperation(operation.id)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
              <button
                onClick={() => handleGeneratePdf(operation)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Generar PDF
              </button>
              <button
                onClick={() => sendWhatsApp(operation.client_id)}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        totalItems={filteredOperations.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default OperationList

