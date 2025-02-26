"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Operation, Client } from "../../types"
import { format, differenceInDays } from "date-fns"
import axios from "../../axiosConfig" // Importa Axios

interface OperationFormProps {
  clients: Client[]
  selectedOperation: Operation | null
  fetchClientsAndOperations: () => Promise<void>
  setSelectedOperation: React.Dispatch<React.SetStateAction<Operation | null>>
}

const OperationForm: React.FC<
  OperationFormProps & { isNewClientAdded: boolean; setIsNewClientAdded: React.Dispatch<React.SetStateAction<boolean>> }
> = ({
  clients,
  selectedOperation,
  fetchClientsAndOperations,
  setSelectedOperation,
  isNewClientAdded, // Nueva prop
  setIsNewClientAdded, // Nueva prop
}) => {
    const [operationNumber, setOperationNumber] = useState(selectedOperation?.operation_number || "")
    const [operationValue, setOperationValue] = useState(selectedOperation?.operation_value || 0)
    const [dueDate, setDueDate] = useState(selectedOperation?.due_date || "")
    const [proxDueDate, setProxDueDate] = useState(selectedOperation?.prox_due_date || "")
    const [amountDue, setAmountDue] = useState(0) // Inicializar con 0
    const [amountPaid, setAmountPaid] = useState(selectedOperation?.amount_paid || 0)
    const [daysOverdue, setDaysOverdue] = useState(selectedOperation?.days_overdue || 0)
    const [cartValue, setCartValue] = useState(selectedOperation?.cart_value || 0)
    const [refinancedDebt, setRefinancedDebt] = useState(selectedOperation?.refinanced_debt || 0)
    const [judicialAction, setJudicialAction] = useState(selectedOperation?.judicial_action || "No")
    const [clientId, setClientId] = useState(selectedOperation?.client_id || "")
    const [debt, setDebt] = useState<number>(0)
    const [newDebt, setNewDebt] = useState<number>(0)

    // Estados para los valores del cliente seleccionado
    const [deadline, setDeadline] = useState<number>(0)
    const [grantDate, setGrantDate] = useState<string>("")

    // Estados para las fechas calculadas
    const [calculatedDueDate, setCalculatedDueDate] = useState<string>("")
    const [calculatedProxDueDate, setCalculatedProxDueDate] = useState<string>("")

    // Estado para el valor vencido
    const [calculatedAmountPaid, setCalculatedAmountPaid] = useState<number>(0)

    // Preseleccionar cliente recién creado si se agregó un cliente nuevo
    useEffect(() => {
      if (isNewClientAdded && clients.length > 0) {
        const lastClient = clients[clients.length - 1] // Último cliente
        if (lastClient && lastClient.id) {
          setClientId(lastClient.id.toString())

          setCalculatedAmountPaid(operationValue - amountDue)
          setDebt(operationValue - amountDue)
        }
      }
    }, [isNewClientAdded, clients, amountDue, operationValue])

    useEffect(() => {
      if (clientId) {
        const numericClientId = typeof clientId === "string" ? Number.parseInt(clientId) : clientId
        const selectedClient = clients.find((client) => client.id === numericClientId)
        if (selectedClient) {
          setDeadline(selectedClient.deadline)
          setGrantDate(selectedClient.grant_date)

          // Obtener últimos 5 dígitos de la identificación
          const identityNumber = selectedClient.identity_number || ""
          const lastFiveDigits = identityNumber.slice(-5)

          // Generar 3 caracteres alfabéticos aleatorios
          const randomChars = Array(3)
            .fill(null)
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
            .join("")

          // Concatenar últimos 5 dígitos y caracteres aleatorios
          setOperationNumber(`${lastFiveDigits}${randomChars}`)

          // Calcular fechas basadas en la fecha de corte del cliente
          if (selectedClient.grant_date) {
            const clientGranDate = new Date(selectedClient.grant_date)

            // Fecha de vencimiento: 30 días después de la fecha de corte
            const dueDateCalculated = new Date(clientGranDate)
            dueDateCalculated.setDate(dueDateCalculated.getDate() + 31)

            // Fecha de próximo vencimiento: 30 días después de la fecha de vencimiento
            const proxDueDateCalculated = new Date(dueDateCalculated)
            proxDueDateCalculated.setDate(proxDueDateCalculated.getDate() + 30)

            // Formatear fechas y actualizar los estados
            const formattedDueDate = format(dueDateCalculated, "yyyy-MM-dd")
            const formattedProxDueDate = format(proxDueDateCalculated, "yyyy-MM-dd")

            setCalculatedDueDate(formattedDueDate)
            setCalculatedProxDueDate(formattedProxDueDate)

            // Actualizar directamente los valores del formulario
            setDueDate(formattedDueDate)
            setProxDueDate(formattedProxDueDate)
          }
        }
      }
    }, [clientId, clients])

    // Limpiar campos del formulario después de guardar la operación
    const resetForm = () => {
      setOperationNumber("")
      setOperationValue(0)
      setDueDate("")
      setProxDueDate("")
      setAmountDue(0)
      setAmountPaid(0)
      setDaysOverdue(0)
      setCartValue(0)
      setRefinancedDebt(0)
      setJudicialAction("")
      setClientId("")
    }

    // Actualiza amountPaid dinámicamente según el valor a vencer
    useEffect(() => {
      setAmountPaid((prev) => prev + amountDue)
    }, [amountDue])

    // Calcular la deuda
    useEffect(() => {
      setDebt(operationValue - calculatedAmountPaid)
    }, [operationValue, calculatedAmountPaid])

    useEffect(() => {
      if (selectedOperation) {
        // Si el valor vencido desde la base de datos es 0, calcula operation_value - amountDue
        const updatedAmountPaid =
          selectedOperation.amount_paid === 0 ? operationValue - amountDue : selectedOperation.amount_paid - amountDue
        setCalculatedAmountPaid(updatedAmountPaid)
      } else {
        setCalculatedAmountPaid(operationValue - amountDue)
      }
    }, [operationValue, amountDue, selectedOperation])

    // Calcular los días vencidos dinámicamente
    useEffect(() => {
      if (dueDate) {
        const dueDateObj = new Date(dueDate)
        const currentDate = new Date()
        const daysDiff = differenceInDays(currentDate, dueDateObj)

        // Si la fecha de vencimiento es mayor o igual a la fecha actual, los días vencidos serán 0
        setDaysOverdue(daysDiff > 0 ? daysDiff : 0)
      }
    }, [dueDate]) // Se ejecuta cada vez que cambie la fecha de vencimiento

    useEffect(() => {
      if (calculatedDueDate) {
        const dueDateObj = new Date(calculatedDueDate)
        const currentDate = new Date()
        const daysDiff = differenceInDays(currentDate, dueDateObj)

        // Si los días son negativos, establecemos días vencidos en 0
        setDaysOverdue(daysDiff > 0 ? daysDiff : 0)
      }
    }, [calculatedDueDate])

    // Función para manejar el submit
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      // Crear objeto de operación
      const operationData = {
        operation_number: operationNumber,
        operation_value: operationValue,
        due_date: dueDate,
        prox_due_date: proxDueDate,
        amount_due: selectedOperation ? debt : amountDue,
        amount_paid: calculatedAmountPaid,
        days_overdue: daysOverdue,
        cart_value: cartValue,
        refinanced_debt: refinancedDebt,
        judicial_action: judicialAction,
        client_id: clientId,
      }

      try {
        if (selectedOperation) {
          // Si hay una operación seleccionada, actualizamos la operación existente
          await axios.put(`/operations/${selectedOperation.id}`, operationData)

          // Si hay un nuevo abono (amountDue > 0), crear registro de pago
          if (amountDue > 0) {
            const paymentData = {
              amount_paid: amountDue,
              amount: debt, // Valor que debe el cliente
              receipt_number: operationNumber,
              client_id: Number(clientId),
              operation_id: selectedOperation.id,
              payment_date: new Date().toISOString().split("T")[0],
            }

            await axios.post("/payments", paymentData)
          }
        } else {
          // Si es una nueva operación, creamos el registro
          const response = await axios.post("/operations", operationData)

          // Crear registro de pago inicial con el valor total de la operación
          const paymentData = {
            amount_paid: amountDue,
            amount: operationValue,
            receipt_number: operationNumber,
            client_id: Number(clientId),
            operation_id: response.data.id,
            payment_date: new Date().toISOString().split("T")[0],
          }

          await axios.post("/payments", paymentData)
        }

        await fetchClientsAndOperations()
        resetForm()
        setSelectedOperation(null)
        setIsNewClientAdded(false)
      } catch (error) {
        console.error("Error al guardar la operación:", error)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {selectedOperation ? "Actualizar Operación" : "Agregar Operación"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="operation_number" className="text-sm font-medium text-gray-700">
              Número de Operación
            </label>
            <input
              id="operation_number"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount_due" className="text-sm font-medium text-gray-700">
              Abono
            </label>
            <input
              id="amount_due"
              type="number"
              onChange={(e) => setAmountDue(Number(e.target.value))}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="operation_value" className="text-sm font-medium text-gray-700">
              Valor de Operación (Crédito del cliente)
            </label>
            <input
              id="operation_value"
              type="number"
              value={operationValue}
              onChange={(e) => setOperationValue(Number(e.target.value))}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deuda */}
          <div className="flex flex-col">
            <label htmlFor="debt" className="text-sm font-medium text-gray-700">
              Valor a vencer (Deuda)
            </label>
            <input
              id="debt"
              type="text"
              value={calculatedAmountPaid}
              onChange={(e) => setDebt(Number(e.target.value))} // Permite editar el campo
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount_paid" className="text-sm font-medium text-gray-700">
              Valor Vencido (Cantidad que ha abonado el cliente)
            </label>
            <input
              id="amount_paid"
              type="number"
              value={debt.toFixed(2)}
              onChange={(e) => setCalculatedAmountPaid(Number(e.target.value))}
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="days_overdue" className="text-sm font-medium text-gray-700">
              Número de Días Vencidos
            </label>
            <input
              id="days_overdue"
              type="number"
              value={daysOverdue}
              className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cart_value" className="text-sm font-medium text-gray-700">
              Valor Castigado
            </label>
            <input
              id="cart_value"
              type="number"
              value={cartValue}
              onChange={(e) => setCartValue(Number(e.target.value))}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="refinanced_debt" className="text-sm font-medium text-gray-700">
              Deuda Refinanciada
            </label>
            <select
              id="refinanced_debt"
              value={refinancedDebt}
              onChange={(e) => setRefinancedDebt(Number(e.target.value))} // Convertimos a número
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar</option>
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="judicial_action" className="text-sm font-medium text-gray-700">
              Acción Judicial
            </label>
            <select
              id="judicial_action"
              value={judicialAction}
              onChange={(e) => setJudicialAction(Number(e.target.value))} // Convertimos a número
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar</option>
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="client_id" className="text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              id="client_id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="due_date" className="text-sm font-medium text-gray-700">
              Fecha de Vencimiento
            </label>
            <input
              id="due_date"
              type="date"
              value={calculatedDueDate}
              readOnly
              className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">30 días después de la fecha de corte del cliente</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="prox_due_date" className="text-sm font-medium text-gray-700">
              Fecha de Siguiente Vencimiento
            </label>
            <input
              id="prox_due_date"
              type="date"
              value={calculatedProxDueDate}
              readOnly
              className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">30 días después de la fecha de vencimiento</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="deadline" className="text-sm font-medium text-gray-700">
              Plazo (Meses)
            </label>
            <input
              id="deadline"
              type="number"
              value={deadline}
              className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
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
              className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selectedOperation ? "Actualizar Operación" : "Agregar Operación"}
        </button>
      </form>
    )
  }

export default OperationForm

