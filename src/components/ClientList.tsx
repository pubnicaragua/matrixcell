import React from 'react';
import axios from '../axiosConfig';
import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  fetchClientsAndOperations: () => Promise<void>; // Para actualizar la lista después de eliminar
}

const ClientsList: React.FC<ClientListProps> = ({ clients, setSelectedClient, fetchClientsAndOperations }) => {
  const deleteClient = async (id: number) => {
    try {
      if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        await axios.delete(`/clients/${id}`);
        await fetchClientsAndOperations();
        alert('Cliente eliminado exitosamente.');
      }
    } catch (error) {
      console.error('Error al eliminar el cliente', error);
      alert('Hubo un error al intentar eliminar el cliente.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-2">{client.name}</h3>
            <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {client.phone}</p>
            <p className="text-sm text-gray-600"><strong>Dirección:</strong> {client.address}</p>
            <p className="text-sm text-gray-600"><strong>Ciudad:</strong> {client.city}</p>
            <p className="text-sm text-gray-600"><strong>Tipo de Identificación:</strong> {client.identity_type}</p>
            <p className="text-sm text-gray-600"><strong>Número de Identificación:</strong> {client.identity_number}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de Corte:</strong> {client.due_date}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de Concesión:</strong> {client.grant_date}</p>
            <p className="text-sm text-gray-600"><strong>Tipo de Deudor:</strong> {client.debt_type}</p>
            <p className="text-sm text-gray-600"><strong>Plazo:</strong> {client.deadline} meses</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedClient(client)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => client.id && deleteClient(client.id)}
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

export default ClientsList;
