import React, { useEffect, useState } from "react";
import api from "../axiosConfig"; // Configuración de Axios

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  category: string;
  status: string;
  operations: Operation[];
}

interface Operation {
  id: number;
  operationNumber: string;
  operationDate: string;
  amountDue: number;
  amountPaid: number;
  daysOverdue: number;
  judicialAction: boolean;
  operationValue: number;
  cartValue: number;
  dueDate: string;
  refinancedDebt: string;
  proxDueDate: string;
  client_id: number; // Relación con cliente
}

const ClientOperationsView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    name: "",
    phone: "",
    address: "",
    category: "",
    status: "Activo",
    operations: [],
  });

  const [newOperation, setNewOperation] = useState<Operation>({
    id: 0,
    operationNumber: "",
    operationDate: "",
    amountDue: 0,
    amountPaid: 0,
    daysOverdue: 0,
    judicialAction: false,
    operationValue: 0,
    cartValue: 0,
    dueDate: "",
    refinancedDebt: "",
    proxDueDate: "",
    client_id: 0,
  });

  const [showOperations, setShowOperations] = useState<number | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showOperationForm, setShowOperationForm] = useState(false);

  useEffect(() => {
    const fetchClientsAndOperations = async () => {
      try {
        // Fetch clients
        const clientsResponse = await api.get("/clients");
        const clientsData = clientsResponse.data;

        // Fetch operations
        const operationsResponse = await api.get("/operations");
        const operationsData = operationsResponse.data;

        // Map operations to their respective clients
        const clientsWithOperations = clientsData.map((client: Client) => ({
          ...client,
          operations: operationsData.filter(
            (operation: Operation) => operation.client_id === client.id
          ),
        }));

        setClients(clientsWithOperations);
      } catch (error) {
        console.error("Error fetching clients and operations:", error);
      }
    };

    fetchClientsAndOperations();
  }, []);

  const handleAddClient = async () => {
    try {
      const response = await api.post("/clients", newClient);
      setClients([...clients, { ...response.data, operations: [] }]);
      setNewClient({
        id: 0,
        name: "",
        phone: "",
        address: "",
        category: "",
        status: "Activo",
        operations: [],
      });
      setShowClientForm(false);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleAddOperation = async (clientId: number) => {
    try {
      const newOperationWithClientId = { ...newOperation, client_id: clientId };
      const response = await api.post("/operations", newOperationWithClientId);

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? { ...client, operations: [...client.operations, response.data] }
            : client
        )
      );

      setNewOperation({
        id: 0,
        operationNumber: "",
        operationDate: "",
        amountDue: 0,
        amountPaid: 0,
        daysOverdue: 0,
        judicialAction: false,
        operationValue: 0,
        cartValue: 0,
        dueDate: "",
        refinancedDebt: "",
        proxDueDate: "",
        client_id: 0,
      });
      setShowOperationForm(false);
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;

    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const toggleOperations = (clientId: number) => {
    setShowOperations(showOperations === clientId ? null : clientId);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Vista de Clientes y Operaciones</h1>

      <button
        onClick={() => setShowClientForm(!showClientForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showClientForm ? "Ocultar Formulario Cliente" : "Agregar Cliente"}
      </button>

      {showClientForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddClient();
          }}
          className="grid grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            className="border px-4 py-2"
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            className="border px-4 py-2"
            required
          />
          {/* Más campos para agregar cliente */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Agregar Cliente
          </button>
        </form>
      )}

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <React.Fragment key={client.id}>
              <tr className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{client.id}</td>
                <td className="border border-gray-300 px-4 py-2">{client.name}</td>
                <td className="border border-gray-300 px-4 py-2">{client.phone}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => toggleOperations(client.id)}
                    className="bg-yellow-500 px-2 py-1 rounded"
                  >
                    Operaciones
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
              {showOperations === client.id && (
                <tr>
                  <td colSpan={4} className="p-4">
                    {client.operations.map((op) => (
                      <div key={op.id}>
                        {op.operationNumber} - ${op.amountDue}
                      </div>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientOperationsView;
