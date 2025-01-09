import React from 'react';
import { Operation, Client } from '../types';

interface OperationListProps {
  operations: Operation[];
  clients: Client[];
  setSelectedOperation: (operation: Operation) => void;
  deleteOperation: (id: number) => void;
}

const OperationList: React.FC<OperationListProps> = ({ operations, clients, setSelectedOperation, deleteOperation }) => {
  // Función para obtener el nombre del cliente según su ID
  const getClientName = (clientId: number) => {
    const client = clients.find(client => client.id === clientId);
    return client ? client.name : 'Desconocido';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Lista de Operaciones</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {operations.map((operation, index) => (
          <div
            key={operation.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-2">Operación #{operation.operation_number}</h3>
            <p className="text-sm text-gray-600">Valor: {operation.operation_value}</p>
            <p className="text-sm text-gray-600">Fecha de Vencimiento: {operation.due_date}</p>
            <p className="text-sm text-gray-600">Próximo Vencimiento: {operation.prox_due_date}</p>
            <p className="text-sm text-gray-600">Monto por Vencer: {operation.amount_due}</p>
            <p className="text-sm text-gray-600">Monto Pagado: {operation.amount_paid}</p>
            <p className="text-sm text-gray-600">Días Vencidos: {operation.days_overdue}</p>
            <p className="text-sm text-gray-600">Valor Castigado: {operation.cart_value}</p>
            <p className="text-sm text-gray-600">Deuda Refinanciada: {operation.refinanced_debt}</p>
            <p className="text-sm text-gray-600">Acción Judicial: {operation.judicial_action}</p>
            <p className="text-sm text-gray-600">Cliente: {getClientName(operation.client_id)}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedOperation(operation)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => operation.id && deleteOperation(operation.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationList;
