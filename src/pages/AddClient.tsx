import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';

interface Client {
  id?: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  identity_number: string;
  identity_type: string;
  due_date: string;
  debt_type: string;
}

interface Operation {
  id?: number;
  operation_number: string;
  operation_date: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  days_overdue: number;
  cart_value: number;
  refinanced_debt: number;
  judicial_action: string;
  client_id: number;
}

const ClientsAndOperationsWithTabs: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('add-client');

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

  const handleClientSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const clientData = Object.fromEntries(formData.entries()) as unknown as Client;

    try {
      if (selectedClient) {
        await api.put(`/clients/${selectedClient.id}`, clientData);
      } else {
        await api.post('/clients', clientData);
      }
      fetchClientsAndOperations();
      setSelectedClient(null);
    } catch (err: any) {
      setError(err.message || 'Error submitting client');
    }
  };

  const handleOperationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const operationData = Object.fromEntries(formData.entries()) as unknown as Operation;

    try {
      if (selectedOperation) {
        await api.put(`/operations/${selectedOperation.id}`, operationData);
      } else {
        await api.post('/operations', operationData);
      }
      fetchClientsAndOperations();
      setSelectedOperation(null);
    } catch (err: any) {
      setError(err.message || 'Error submitting operation');
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await api.delete(`/clients/${id}`);
      fetchClientsAndOperations();
    } catch (err: any) {
      setError(err.message || 'Error deleting client');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes y Operaciones</h1>
      <div className="mb-4">
        <button onClick={() => setActiveTab('add-client')} className={`mr-2 px-4 py-2 ${activeTab === 'add-client' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Agregar Cliente</button>
        <button onClick={() => setActiveTab('add-operation')} className={`mr-2 px-4 py-2 ${activeTab === 'add-operation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Agregar Operación</button>
        <button onClick={() => setActiveTab('client-list')} className={`mr-2 px-4 py-2 ${activeTab === 'client-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Lista de Clientes</button>
        <button onClick={() => setActiveTab('operation-list')} className={`px-4 py-2 ${activeTab === 'operation-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Lista de Operaciones</button>
      </div>
      
      {activeTab === 'add-client' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Agregar Cliente</h2>
          <form onSubmit={handleClientSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-1">Nombre</label>
                <input id="name" name="name" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1">Teléfono</label>
                <input id="phone" name="phone" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="address" className="block mb-1">Dirección</label>
                <input id="address" name="address" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="city" className="block mb-1">Ciudad</label>
                <input id="city" name="city" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="identity_number" className="block mb-1">Número de Identidad</label>
                <input id="identity_number" name="identity_number" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="identity_type" className="block mb-1">Tipo de Identidad</label>
                <input id="identity_type" name="identity_type" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="due_date" className="block mb-1">Fecha de Vencimiento</label>
                <input id="due_date" name="due_date" type="date" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="debt_type" className="block mb-1">Tipo de Deuda</label>
                <input id="debt_type" name="debt_type" type="text" className="w-full p-2 border rounded" required />
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              {selectedClient ? 'Actualizar Cliente' : 'Agregar Cliente'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'add-operation' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Agregar Operación</h2>
          <form onSubmit={handleOperationSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="operation_number" className="block mb-1">Número de Operación</label>
                <input id="operation_number" name="operation_number" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="operation_date" className="block mb-1">Fecha de Operación</label>
                <input id="operation_date" name="operation_date" type="date" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="due_date" className="block mb-1">Fecha de Vencimiento</label>
                <input id="due_date" name="due_date" type="date" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="amount_due" className="block mb-1">Monto Adeudado</label>
                <input id="amount_due" name="amount_due" type="number" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="amount_paid" className="block mb-1">Monto Pagado</label>
                <input id="amount_paid" name="amount_paid" type="number" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="days_overdue" className="block mb-1">Días de Atraso</label>
                <input id="days_overdue" name="days_overdue" type="number" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="cart_value" className="block mb-1">Valor del Carrito</label>
                <input id="cart_value" name="cart_value" type="number" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="refinanced_debt" className="block mb-1">Deuda Refinanciada</label>
                <input id="refinanced_debt" name="refinanced_debt" type="number" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="judicial_action" className="block mb-1">Acción Judicial</label>
                <input id="judicial_action" name="judicial_action" type="text" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="client_id" className="block mb-1">Cliente</label>
                <select id="client_id" name="client_id" className="w-full p-2 border rounded" required>
                  <option value="">Seleccionar Cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id?.toString() || ''}>{client.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              {selectedOperation ? 'Actualizar Operación' : 'Agregar Operación'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'client-list' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
          {clients.map(client => (
            <div key={client.id} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <p>Número de Identidad: {client.identity_number}</p>
              <p>Teléfono: {client.phone}</p>
              <p>Dirección: {client.address}, {client.city}</p>
              <p>Tipo de Deuda: {client.debt_type}</p>
              <p>Fecha de Vencimiento: {client.due_date}</p>
              <div className="mt-2">
                <button onClick={() => setSelectedClient(client)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                <button onClick={() => client.id && deleteClient(client.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'operation-list' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lista de Operaciones</h2>
          {operations.map(operation => (
            <div key={operation.id} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold">Operación #{operation.operation_number}</h3>
              <p>Fecha: {operation.operation_date}</p>
              <p>Monto Adeudado: ${operation.amount_due}</p>
              <p>Monto Pagado: ${operation.amount_paid}</p>
              <p>Días de Atraso: {operation.days_overdue}</p>
              <p>Cliente: {clients.find(c => c.id === operation.client_id)?.name}</p>
              <div className="mt-2">
                <button onClick={() => setSelectedOperation(operation)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                <button onClick={() => operation.id && deleteOperation(operation.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsAndOperationsWithTabs;

