import React, { useState, useEffect } from 'react';
import { Operation, Client } from '../types';
import { addMonths, format, differenceInDays } from 'date-fns';
import axios from '../axiosConfig';  // Importa Axios

interface OperationFormProps {
    clients: Client[];
    selectedOperation: Operation | null;
    fetchClientsAndOperations: () => Promise<void>;
    setSelectedOperation: React.Dispatch<React.SetStateAction<Operation | null>>;
}

const OperationForm: React.FC<OperationFormProps & { isNewClientAdded: boolean; setIsNewClientAdded: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    clients,
    selectedOperation,
    fetchClientsAndOperations,
    setSelectedOperation,
    isNewClientAdded, // Nueva prop
    setIsNewClientAdded, // Nueva prop
}) => {
    const [operationNumber, setOperationNumber] = useState(selectedOperation?.operation_number || '');
    const [operationValue, setOperationValue] = useState(selectedOperation?.operation_value || 0);
    const [dueDate, setDueDate] = useState(selectedOperation?.due_date || '');
    const [proxDueDate, setProxDueDate] = useState(selectedOperation?.prox_due_date || '');
    const [amountDue, setAmountDue] = useState(selectedOperation?.amount_due || 0);
    const [amountPaid, setAmountPaid] = useState(selectedOperation?.amount_paid || 0);
    const [daysOverdue, setDaysOverdue] = useState(selectedOperation?.days_overdue || 0);
    const [cartValue, setCartValue] = useState(selectedOperation?.cart_value || 0);
    const [refinancedDebt, setRefinancedDebt] = useState(selectedOperation?.refinanced_debt || 0);
    const [judicialAction, setJudicialAction] = useState(selectedOperation?.judicial_action || '');
    const [clientId, setClientId] = useState(selectedOperation?.client_id || '');

    // Estados para los valores del cliente seleccionado
    const [deadline, setDeadline] = useState<number>(0);
    const [grantDate, setGrantDate] = useState<string>('');

    // Estados para las fechas calculadas
    const [calculatedDueDate, setCalculatedDueDate] = useState<string>('');
    const [calculatedProxDueDate, setCalculatedProxDueDate] = useState<string>('');

    // Estado para el valor vencido
    const [calculatedAmountPaid, setCalculatedAmountPaid] = useState<number>(0);

    // Preseleccionar cliente recién creado si se agregó un cliente nuevo
    useEffect(() => {
        if (isNewClientAdded && clients.length > 0) {
            const lastClient = clients[clients.length - 1]; // Último cliente
            if (lastClient && lastClient.id) {
                setClientId(lastClient.id.toString());
            }
        }
    }, [isNewClientAdded, clients]);

    useEffect(() => {
        if (clientId) {
            const numericClientId = typeof clientId === 'string' ? parseInt(clientId) : clientId;
            const selectedClient = clients.find(client => client.id === numericClientId);
            if (selectedClient) {
                setDeadline(selectedClient.deadline);
                setGrantDate(selectedClient.grant_date);
    
                // Obtener últimos 5 dígitos de la identificación
                const identityNumber = selectedClient.identity_number || '';
                const lastFiveDigits = identityNumber.slice(-5);
    
                // Generar 3 caracteres alfabéticos aleatorios
                const randomChars = Array(3)
                    .fill(null)
                    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // A-Z
                    .join('');
    
                // Concatenar últimos 5 dígitos y caracteres aleatorios
                setOperationNumber(`${lastFiveDigits}${randomChars}`);
    
                // Calcular fechas de vencimiento y próximo vencimiento
                const grantDateObj = new Date(selectedClient.grant_date);
    
                // Calcular la fecha de vencimiento como un mes después de la fecha de concesión
                const dueDateCalculated = addMonths(grantDateObj, 1); // Un mes después
    
                // Calcular la fecha de próximo vencimiento como plazo (en meses) más la fecha de concesión
                const proxDueDateCalculated = addMonths(grantDateObj, selectedClient.deadline);
    
                // Formatear fechas y actualizar los estados
                const formattedDueDate = format(dueDateCalculated, 'yyyy-MM-dd');
                const formattedProxDueDate = format(proxDueDateCalculated, 'yyyy-MM-dd');
    
                setCalculatedDueDate(formattedDueDate);
                setCalculatedProxDueDate(formattedProxDueDate);
    
                // Actualizar directamente los valores del formulario
                setDueDate(formattedDueDate);
                setProxDueDate(formattedProxDueDate);
            }
        }
    }, [clientId, clients]);
    

    // Limpiar campos del formulario después de guardar la operación
    const resetForm = () => {
        setOperationNumber('');
        setOperationValue(0);
        setDueDate('');
        setProxDueDate('');
        setAmountDue(0);
        setAmountPaid(0);
        setDaysOverdue(0);
        setCartValue(0);
        setRefinancedDebt(0);
        setJudicialAction('');
        setClientId('');
    };


    // Calcular el valor vencido
    useEffect(() => {
        setCalculatedAmountPaid(operationValue - amountDue);
    }, [operationValue, amountDue]);

    // Calcular los días vencidos dinámicamente
    useEffect(() => {
        if (dueDate) {
            const dueDateObj = new Date(dueDate);
            const currentDate = new Date();
            const daysDiff = differenceInDays(currentDate, dueDateObj);

            // Si la fecha de vencimiento es mayor o igual a la fecha actual, los días vencidos serán 0
            setDaysOverdue(daysDiff > 0 ? daysDiff : 0);
        }
    }, [dueDate]);  // Se ejecuta cada vez que cambie la fecha de vencimiento

    useEffect(() => {
        if (calculatedDueDate) {
            const dueDateObj = new Date(calculatedDueDate);
            const currentDate = new Date();
            const daysDiff = differenceInDays(currentDate, dueDateObj);

            // Si los días son negativos, establecemos días vencidos en 0
            setDaysOverdue(daysDiff > 0 ? daysDiff : 0);
        }
    }, [calculatedDueDate]);

    // Función para manejar el submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Crear objeto de operación
        const operationData = {
            operation_number: operationNumber,
            operation_value: operationValue,
            due_date: dueDate,
            prox_due_date: proxDueDate,
            amount_due: amountDue,
            amount_paid: calculatedAmountPaid,
            days_overdue: daysOverdue,
            cart_value: cartValue,
            refinanced_debt: refinancedDebt,
            judicial_action: judicialAction,
            client_id: clientId
        };

        try {
            // Hacer la solicitud POST a la ruta '/operations'
            if (selectedOperation) {
                // Si hay una operación seleccionada, actualizamos la operación existente
                await axios.put(`/operations/${selectedOperation.id}`, operationData);

            } else {
                // Si no hay una operación seleccionada, creamos una nueva operación
                await axios.post('/operations', operationData);
            }
            // Una vez que la operación se haya guardado, refrescamos los datos
            await fetchClientsAndOperations();

            resetForm(); // Limpia el formulario
            setSelectedOperation(null); // Limpia la selección de operación
            setIsNewClientAdded(false); // Limpia el estado de cliente nuevo (prop desde el padre)
        } catch (error) {
            console.error('Error al guardar la operación:', error);
            // Aquí podrías manejar el error con un mensaje al usuario si lo deseas
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {selectedOperation ? 'Actualizar Operación' : 'Agregar Operación'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="operation_number" className="text-sm font-medium text-gray-700">Número de Operación</label>
                    <input
                        id="operation_number"
                        value={operationNumber}
                        onChange={(e) => setOperationNumber(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="operation_value" className="text-sm font-medium text-gray-700">Valor de Operación</label>
                    <input
                        id="operation_value"
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="due_date" className="text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                    <input
                        id="due_date"
                        type="date"
                        value={calculatedDueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="prox_due_date" className="text-sm font-medium text-gray-700">Fecha de Siguiente Vencimiento</label>
                    <input
                        id="prox_due_date"
                        type="date"
                        value={calculatedProxDueDate}
                        onChange={(e) => setProxDueDate(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="amount_due" className="text-sm font-medium text-gray-700">Valor a Vencer</label>
                    <input
                        id="amount_due"
                        type="number"
                        value={amountDue}
                        onChange={(e) => setAmountDue(Number(e.target.value))}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="amount_paid" className="text-sm font-medium text-gray-700">Valor Vencido</label>
                    <input
                        id="amount_paid"
                        type="text"
                        value={formatCurrency(calculatedAmountPaid)}
                        readOnly
                        className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="days_overdue" className="text-sm font-medium text-gray-700">Número de Días Vencidos</label>
                    <input
                        id="days_overdue"
                        type="number"
                        value={daysOverdue}
                        readOnly
                        className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="cart_value" className="text-sm font-medium text-gray-700">Valor Castigado</label>
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
                    <label htmlFor="refinanced_debt" className="text-sm font-medium text-gray-700">Deuda Refinanciada</label>
                    <input
                        id="refinanced_debt"
                        type="number"
                        value={refinancedDebt}
                        onChange={(e) => setRefinancedDebt(Number(e.target.value))}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="judicial_action" className="text-sm font-medium text-gray-700">Acción Judicial</label>
                    <input
                        id="judicial_action"
                        value={judicialAction}
                        onChange={(e) => setJudicialAction(e.target.value)}
                        required
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="client_id" className="text-sm font-medium text-gray-700">Cliente</label>
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
                    <label htmlFor="deadline" className="text-sm font-medium text-gray-700">Plazo (Meses)</label>
                    <input
                        id="deadline"
                        type="number"
                        value={deadline}
                        readOnly
                        className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="grant_date" className="text-sm font-medium text-gray-700">Fecha de Concesión</label>
                    <input
                        id="grant_date"
                        type="date"
                        value={grantDate}
                        readOnly
                        className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {selectedOperation ? 'Actualizar Operación' : 'Agregar Operación'}
            </button>
        </form>
    );
};

export default OperationForm;