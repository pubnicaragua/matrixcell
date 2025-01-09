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
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Número de Operación</th>
            <th className="border border-gray-300 px-4 py-2">Valor</th>
            <th className="border border-gray-300 px-4 py-2">Fecha de Vencimiento</th>
            <th className="border border-gray-300 px-4 py-2">Próximo Vencimiento</th>
            <th className="border border-gray-300 px-4 py-2">Monto por Vencer</th>
            <th className="border border-gray-300 px-4 py-2">Monto Pagado</th>
            <th className="border border-gray-300 px-4 py-2">Días Vencidos</th>
            <th className="border border-gray-300 px-4 py-2">Valor Castigado</th>
            <th className="border border-gray-300 px-4 py-2">Deuda Refinanciada</th>
            <th className="border border-gray-300 px-4 py-2">Acción Judicial</th>
            <th className="border border-gray-300 px-4 py-2">Cliente</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation, index) => (
            <tr key={operation.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.operation_number}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.operation_value}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.due_date}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.prox_due_date}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.amount_due}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.amount_paid}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.days_overdue}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.cart_value}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.refinanced_debt}</td>
              <td className="border border-gray-300 px-4 py-2">{operation.judicial_action}</td>
              <td className="border border-gray-300 px-4 py-2">{getClientName(operation.client_id)}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => setSelectedOperation(operation)}
                  className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => operation.id && deleteOperation(operation.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperationList;
