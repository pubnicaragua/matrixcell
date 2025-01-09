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
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Teléfono</th>
            <th className="border border-gray-300 px-4 py-2">Dirección</th>
            <th className="border border-gray-300 px-4 py-2">Ciudad</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Identificación</th>
            <th className="border border-gray-300 px-4 py-2">Número de Identificación</th>
            <th className="border border-gray-300 px-4 py-2">Fecha de Corte</th>
            <th className="border border-gray-300 px-4 py-2">Fecha de Concesión</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Deudor</th>
            <th className="border border-gray-300 px-4 py-2">Plazo</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{client.name}</td>
              <td className="border border-gray-300 px-4 py-2">{client.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{client.address}</td>
              <td className="border border-gray-300 px-4 py-2">{client.city}</td>
              <td className="border border-gray-300 px-4 py-2">{client.identity_type}</td>
              <td className="border border-gray-300 px-4 py-2">{client.identity_number}</td>
              <td className="border border-gray-300 px-4 py-2">{client.due_date}</td>
              <td className="border border-gray-300 px-4 py-2">{client.grant_date}</td>
              <td className="border border-gray-300 px-4 py-2">{client.debt_type}</td>
              <td className="border border-gray-300 px-4 py-2">{client.deadline}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => client.id && deleteClient(client.id)}
                  className="text-red-500 hover:underline"
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

export default ClientsList;
