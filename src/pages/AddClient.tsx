import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { Client, Operation } from '../types';
import ClientForm from '../components/ClientForm';
import OperationForm from '../components/OperationForm';
import ClientsList from '../components/ClientList';
import OperationsList from '../components/OperationList';

const ClientsAndOperationsWithTabs: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('add-client');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchClientsAndOperations();
  }, []);

  const fetchClientsAndOperations = async () => {
    try {
      setLoading(true);
      const [clientsResponse, operationsResponse] = await Promise.all([
        api.get('/clients'),
        api.get('/operations')
      ]);
      setClients(clientsResponse.data);
      setOperations(operationsResponse.data);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`);
      await fetchClientsAndOperations();
      alert('Cliente eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Hubo un error al intentar eliminar el cliente.');
    }
  };

  const deleteOperation = async (id: number) => {
    try {
      await api.delete(`/operations/${id}`);
      fetchClientsAndOperations();
    } catch (err: any) {
      setError(err.message || 'Error deleting operation');
    }
  };

  const handleSetSelectedClient = (client: Client | null) => {
    setSelectedClient(client);
    setActiveTab('add-client');
  };

  const handleSetSelectedOperation: React.Dispatch<React.SetStateAction<Operation | null>> = (operation) => {
    if (typeof operation === 'function') {
      setSelectedOperation((prev) => operation(prev));
    } else {
      setSelectedOperation(operation);
      setActiveTab('add-operation');
    }
  };

  const handleSendEmail = () => {
    if (!email) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    const subject = encodeURIComponent('Información de Clientes y Operaciones');
    const body = encodeURIComponent('Estimado usuario, aquí está la información solicitada.');
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes y Operaciones</h1>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('add-client')}
          className={`mr-2 px-4 py-2 ${activeTab === 'add-client' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Agregar Cliente
        </button>
        <button
          onClick={() => setActiveTab('add-operation')}
          className={`mr-2 px-4 py-2 ${activeTab === 'add-operation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Agregar Operación
        </button>
        <button
          onClick={() => setActiveTab('client-list')}
          className={`mr-2 px-4 py-2 ${activeTab === 'client-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Lista de Clientes
        </button>
        <button
          onClick={() => setActiveTab('operation-list')}
          className={`px-4 py-2 ${activeTab === 'operation-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Lista de Operaciones
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese el correo"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <button
          onClick={handleSendEmail}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Enviar Correo
        </button>
      </div>

      {activeTab === 'add-client' && (
        <ClientForm
          clients={clients}
          selectedClient={selectedClient}
          fetchClientsAndOperations={fetchClientsAndOperations}
          setSelectedClient={handleSetSelectedClient}
        />
      )}
      {activeTab === 'add-operation' && (
        <OperationForm
          clients={clients}
          selectedOperation={selectedOperation}
          fetchClientsAndOperations={fetchClientsAndOperations}
          setSelectedOperation={handleSetSelectedOperation}
        />
      )}
      {activeTab === 'client-list' && (
        <ClientsList
          clients={clients}
          setSelectedClient={handleSetSelectedClient}
          fetchClientsAndOperations={fetchClientsAndOperations}
        />
      )}
      {activeTab === 'operation-list' && (
        <OperationsList
          operations={operations}
          clients={clients}
          setSelectedOperation={handleSetSelectedOperation}
          deleteOperation={deleteOperation}
        />
      )}
    </div>
  );
};

export default ClientsAndOperationsWithTabs;
