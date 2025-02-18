"use client"

// Importa los tipos necesarios
import type React from "react"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig" // Importamos Axios
import type { Client } from "../../types"

interface ClientFormProps {
  clients: Client[]
  selectedClient: Client | null
  fetchClientsAndOperations: () => Promise<void>
  setSelectedClient: (client: Client | null) => void
}

interface Store {
  id: number
  name: string
}

const ClientForm: React.FC<ClientFormProps> = ({
  clients,
  selectedClient,
  fetchClientsAndOperations,
  setSelectedClient,
}) => {
  const [name, setName] = useState(selectedClient?.name || "")
  const [email, setEmail] = useState(selectedClient?.email || "")
  const [phone, setPhone] = useState(selectedClient?.phone || "")
  const [address, setAddress] = useState(selectedClient?.address || "")
  const [city, setCity] = useState(selectedClient?.city || "")
  const [identityNumber, setIdentityNumber] = useState(selectedClient?.identity_number || "")
  const [identityType, setIdentityType] = useState(selectedClient?.identity_type || "Cédula")
  const [dueDate, setDueDate] = useState(selectedClient?.due_date || "")
  const [grantDate, setGrantDate] = useState(selectedClient?.grant_date || "")
  const [debtType, setDebtType] = useState(selectedClient?.debt_type || "")
  const [deadline, setDeadline] = useState(selectedClient?.deadline || 0)
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [userRole, setUserRole] = useState<number>(0)
  const [userStore, setUserStore] = useState<number | null>(null)

  useEffect(() => {
    // Obtener información del usuario del localStorage
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
      setUserStore(parsedPerfil.store_id || null)

      // Si no es admin, establecer la tienda automáticamente
      if (parsedPerfil.rol_id !== 1) {
        setSelectedStore(parsedPerfil.store?.id || null)
      }
    }

    // Si es admin, cargar la lista de tiendas
    if (userRole === 1) {
      fetchStores()
    }
  }, [userRole])

  const fetchStores = async () => {
    try {
      const response = await axios.get("/stores")
      setStores(response.data)
    } catch (error) {
      console.error("Error al cargar las tiendas:", error)
    }
  }

  // Función para limpiar el formulario
  const resetForm = () => {
    setName("")
    setPhone("")
    setAddress("")
    setCity("")
    setIdentityNumber("")
    setIdentityType("Cédula")
    setDueDate("")
    setGrantDate("")
    setDebtType("")
    setDeadline(0)
    setEmail("")
    if (userRole === 1) {
      setSelectedStore(null)
    }
    setSelectedClient(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!grantDate || isNaN(new Date(grantDate).getTime())) {
      alert("Por favor, ingresa una fecha de concesión válida.")
      return
    }

    // Verificar que se haya seleccionado una tienda
    const storeId = userRole === 1 ? selectedStore : userStore
    if (!storeId) {
      alert("Por favor, selecciona una tienda.")
      return
    }

    // Creamos el objeto con los datos del formulario
    const clientData: Client = {
      name,
      phone,
      address,
      city,
      identity_number: identityNumber,
      identity_type: identityType,
      due_date: dueDate,
      grant_date: grantDate,
      debt_type: debtType,
      deadline: deadline,
      email,
      deleted: false,
      store_id: storeId, // Agregamos el store_id
    }

    try {
      let response
      if (selectedClient) {
        await axios.put(`/clients/${selectedClient.id}`, clientData)
      } else {
        response = await axios.post("/clients", clientData)
      }

      await fetchClientsAndOperations()
      resetForm()

      if (!selectedClient && response?.data) {
        const newClient = response.data
        setSelectedClient(newClient)
        setSelectedClient(null)
      }
    } catch (error) {
      console.error("Error al guardar el cliente:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {selectedClient ? "Actualizar Cliente" : "Agregar Cliente"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de tienda solo para administradores */}
        {userRole === 1 && (
          <div className="md:col-span-2">
            <label htmlFor="store" className="block text-sm font-medium text-gray-700">
              Tienda
            </label>
            <select
              id="store"
              value={selectedStore || ""}
              onChange={(e) => setSelectedStore(Number(e.target.value))}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            >
              <option value="">Selecciona una tienda</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="identity_number" className="block text-sm font-medium text-gray-700">
            Número de Identidad
          </label>
          <input
            id="identity_number"
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="identity_type" className="block text-sm font-medium text-gray-700">
            Tipo de Identidad
          </label>
          <input
            id="identity_type"
            placeholder="Solo Cédula"
            value={identityType}
            onChange={(e) => setIdentityType(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Fecha de Corte
          </label>
          <input
            id="due_date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="grant_date" className="block text-sm font-medium text-gray-700">
            Tipo de Deudor
          </label>
          <input
            id="debt_type"
            type="text"
            value={debtType}
            onChange={(e) => setDebtType(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="grant_date" className="text-sm font-medium text-gray-700">
            Fecha de Concesión
          </label>
          <input
            id="grant_date"
            type="date"
            value={grantDate}
            onChange={(e) => setGrantDate(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Plazo (Meses)
          </label>
          <input
            id="deadline"
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(Number(e.target.value))}
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>
      </div>

      <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        {selectedClient ? "Actualizar Cliente" : "Agregar Cliente"}
      </button>
    </form>
  )
}

export default ClientForm

