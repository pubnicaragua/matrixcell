"use client"

// Importa los tipos necesarios
import type React from "react"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig" // Importamos Axios
import type { Client } from "../../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"

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
  const [grantDate, setGrantDate] = useState(selectedClient?.grant_date || "")
  const [debtType, setDebtType] = useState(selectedClient?.debt_type || "")
  const [deadline, setDeadline] = useState(selectedClient?.deadline || 3)
  const [frequency, setFrequency] = useState(selectedClient?.frequency || "Mensual") // Nuevo estado para frecuencia
  const [contract_number, setContractNumber] = useState(selectedClient?.contract_number || "")
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [userRole, setUserRole] = useState<number>(0)
  const [userStore, setUserStore] = useState<number | null>(null)

  // Agregar estos estados para manejar errores después de los estados existentes
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const getLastDayOfMonth = () => {
    const today = new Date()
    // Obtener el último día del mes actual
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return lastDay.toISOString().split("T")[0] // Returns YYYY-MM-DD format
  }

  const [calculatedDueDate, setCalculatedDueDate] = useState(getLastDayOfMonth())

  useEffect(() => {
    setCalculatedDueDate(getLastDayOfMonth())
  }, []) // Se ejecuta solo al montar el componente

  useEffect(() => {
    // Obtener información del usuario del localStorage
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
      setUserStore(parsedPerfil.store?.id || null)

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
    setGrantDate("")
    setDebtType("")
    setDeadline(0)
    setEmail("")
    setContractNumber("")
    if (userRole === 1) {
      setSelectedStore(null)
    }
    setSelectedClient(null)
  }

  // Agregar estas funciones de validación antes del handleSubmit
  const validateEmail = (email: string) => {
    if (!email) return true // Es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateIdentityNumber = (number: string) => {
    const numberRegex = /^[0-9]+$/
    return numberRegex.test(number)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validar campos requeridos
    if (!name.trim()) newErrors.name = "El nombre es requerido"
    if (!address.trim()) newErrors.address = "La dirección es requerida"
    if (!city.trim()) newErrors.city = "La ciudad es requerida"
    if (!identityNumber.trim()) {
      newErrors.identityNumber = "El número de identidad es requerido"
    } else if (!validateIdentityNumber(identityNumber)) {
      newErrors.identityNumber = "El número de identidad debe contener solo números"
    }

    // Validar email si se proporciona
    if (email && !validateEmail(email)) {
      newErrors.email = "Formato de correo electrónico inválido"
    }

    // Validar teléfono si se proporciona
    if (!phone) {
      newErrors.phone = "El número de teléfono es requerido"
    }

    // Validar fecha de concesión
    if (!grantDate) {
      newErrors.grantDate = "La fecha de concesión es requerida"
    }

    // Validar plazo
    if (deadline <= 0) {
      newErrors.deadline = "El plazo debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modificar el handleSubmit existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      return
    }

    // Verificar que se haya seleccionado una tienda
    const storeId = userRole === 1 ? selectedStore : userStore
    if (!storeId) {
      setErrors((prev) => ({ ...prev, store: "Por favor, selecciona una tienda" }))
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
      due_date: getLastDayOfMonth(), // Ahora simplemente obtiene el último día del mes actual
      grant_date: grantDate,
      debt_type: debtType,
      deadline: deadline,
      frequency: frequency, // Agregar el nuevo campo frequency
      email,
      deleted: false,
      store_id: storeId, // Agregamos el store_id
      contract_number,
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
            Nombre *
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: "" }))
              }
            }}
            className={`mt-1 p-2 w-full border rounded-lg ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo (opcional)
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }))
              }
            }}
            className={`mt-1 p-2 w-full border rounded-lg ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) {
                setErrors((prev) => ({ ...prev, phone: "" }))
              }
            }}
            className={`mt-1 p-2 w-full border rounded-lg ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
            Número de Identidad *
          </label>
          <input
            id="identity_number"
            value={identityNumber}
            onChange={(e) => {
              setIdentityNumber(e.target.value)
              if (errors.identityNumber) {
                setErrors((prev) => ({ ...prev, identityNumber: "" }))
              }
            }}
            className={`mt-1 p-2 w-full border rounded-lg ${errors.identityNumber ? "border-red-500" : ""}`}
          />
          {errors.identityNumber && <p className="text-red-500 text-xs mt-1">{errors.identityNumber}</p>}
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Numero de contrato *
          </label>
          <input
            id="contract_number"
            value={contract_number}
            onChange={(e) => {
              setContractNumber(e.target.value)
              if (errors.contract_number) {
                setErrors((prev) => ({ ...prev, contract_number: "" }))
              }
            }}
            className={`mt-1 p-2 w-full border rounded-lg ${errors.contract_number ? "border-red-500" : ""}`}
          />
          {errors.contract_number && <p className="text-red-500 text-xs mt-1">{errors.contract_number}</p>}
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
            onChange={(e) => {
              setGrantDate(e.target.value)
            }}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="due_date" className="text-sm font-medium text-gray-700">
            Fecha de Corte (automática)
          </label>
          <input
            id="due_date"
            type="date"
            value={calculatedDueDate}
            readOnly
            className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Último día del mes actual</p>
        </div>

        <div className="">
          <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
            Frecuencia de Pago
          </Label>
          <Select value={frequency} onValueChange={(value) => setFrequency(value)}>
            <SelectTrigger id="frequency" className="col-span-3">
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Mensual">Mensual</SelectItem>
              <SelectItem value="Quincenal">Quincenal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Label htmlFor="deadline"  className="text-sm font-medium text-gray-700">
            Plazo (Meses) *
          </Label>
          <Select
            value={deadline.toString()}
            onValueChange={(value) => {
              setDeadline(Number(value))
              if (errors.deadline) {
                setErrors((prev) => ({ ...prev, deadline: "" }))
              }
            }}
          >
            <SelectTrigger id="deadline" className="col-span-3">
              <SelectValue placeholder="Seleccione plazo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="9">9 meses</SelectItem>
            </SelectContent>
          </Select>
          {errors.deadline && <p className="text-red-500 text-xs mt-1 col-span-3 col-start-2">{errors.deadline}</p>}
        </div>
      </div>

      <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        {selectedClient ? "Actualizar Cliente" : "Agregar Cliente"}
      </button>
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">Por favor, corrige los errores antes de continuar.</p>
        </div>
      )}
    </form>
  )
}

export default ClientForm

