"use client"

import { useEffect, useState } from "react"
import api from "../axiosConfig"
import * as XLSX from "xlsx"
import { useAuth } from "../context/AuthContext"

interface Invoice {
  id: number
  amount: number | null
  number: string
  client_name: string
  status: string
  created_at: string
  store_id: number
}

const InvoicesView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const { userRole, userStore } = useAuth()
  const [storeName, setStoreName] = useState<string>("")

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get("/invoices")
        // Filtrar facturas por tienda si el usuario no es admin
        const filteredInvoices =
          userRole === 1 ? response.data : response.data.filter((invoice: Invoice) => invoice.store_id === userStore)
        setInvoices(filteredInvoices)
      } catch (err: any) {
        setError(err.message || "Error al obtener facturas")
      } finally {
        setLoading(false)
      }
    }

    const getStoreName = () => {
      const perfil = localStorage.getItem("perfil")
      if (perfil) {
        const parsedPerfil = JSON.parse(perfil)
        setStoreName(parsedPerfil.store?.name || "")
      }
    }

    fetchInvoices()
    getStoreName()
  }, [userRole, userStore])

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Pendiente" ? "Pagada" : "Pendiente"
    try {
      const response = await api.put(`/invoices/${id}`, { status: newStatus })
      if (response.status === 200) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) => (invoice.id === id ? { ...invoice, status: newStatus } : invoice)),
        )
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (err: any) {
      setError(err.message || "Error al actualizar el estado de la factura")
    }
  }

  const filteredInvoices = invoices.filter((invoice) => invoice.number.toLowerCase().includes(search.toLowerCase()))

  // Función para exportar a Excel
  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()

    // Convertir las facturas a una hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        Número: invoice.number,
        Monto: invoice.amount !== null ? `$${invoice.amount.toFixed(2)}` : "N/A",
        "Nombre del cliente": invoice.client_name,
        Estado: invoice.status,
        "Fecha de Creación": new Date(invoice.created_at).toLocaleString(),
      })),
    )

    XLSX.utils.book_append_sheet(wb, ws, "Facturas")

    // Exportar el libro de trabajo como archivo .xlsx
    XLSX.writeFile(wb, "facturas.xlsx")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Lista de Facturas</h1>
        {!loading && storeName && <h2 className="text-xl text-gray-600 mt-2">Tienda: {storeName}</h2>}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Buscar por número de factura"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 p-2 border border-gray-300 rounded-lg"
        />
        <button onClick={handleExportToExcel} className="ml-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Exportar a Excel
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Número</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nombre del cliente</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Fecha de Creación</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {invoice.amount !== null ? `$${invoice.amount.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.client_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{new Date(invoice.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleToggleStatus(invoice.id, invoice.status)}
                      className={`px-4 py-2 rounded-lg text-white ${
                        invoice.status === "Pendiente" ? "bg-green-500" : "bg-yellow-500"
                      } hover:opacity-90`}
                    >
                      {invoice.status === "Pendiente" ? "Marcar como Pagada" : "Marcar como Pendiente"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InvoicesView

