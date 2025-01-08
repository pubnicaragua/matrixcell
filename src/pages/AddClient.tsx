import React, { useState, useEffect } from "react";
import api from "../axiosConfig"; // Configuración de Axios

interface Client {
  id: number;
  name: string;
  identity_number: string;
  identity_type: string;
  address: string;
  phone: string;
  city: string;
  due_date: string;
  debt_type: string;
  deadline: string; // Nuevo campo
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Partial<Client>>({});
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (err: any) {
        setError(err.message || "Error fetching clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient({ ...editingClient, [name]: value });
    } else {
      setNewClient({ ...newClient, [name]: value });
    }
  };

  const createClient = async () => {
    try {
      const response = await api.post("/clients", newClient);
      setClients([...clients, response.data]);
      setNewClient({});
    } catch (err: any) {
      setError(err.message || "Error creating client");
    }
  };

  const updateClient = async (id: number) => {
    try {
      const response = await api.put(`/clients/${id}`, editingClient);
      setClients(clients.map(client => (client.id === id ? response.data : client)));
      setEditingClient(null);
    } catch (err: any) {
      setError(err.message || "Error updating client");
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter(client => client.id !== id));
    } catch (err: any) {
      setError(err.message || "Error deleting client");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* Formulario para agregar un nuevo cliente */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Agregar Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Nombre"
                value={newClient.name || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="identity_number"
                placeholder="Número de Identidad"
                value={newClient.identity_number || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <select
                name="identity_type"
                value={newClient.identity_type || ""}
                onChange={handleInputChange}
                className="border p-2"
              >
                <option value="">Tipo de Identidad</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              <input
                name="address"
                placeholder="Dirección"
                value={newClient.address || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="phone"
                placeholder="Teléfono"
                value={newClient.phone || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="city"
                placeholder="Ciudad"
                value={newClient.city || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="due_date"
                placeholder="Fecha de Vencimiento"
                value={newClient.due_date || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="debt_type"
                placeholder="Tipo de Deuda"
                value={newClient.debt_type || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
              <input
                name="deadline"
                placeholder="Plazo"
                value={newClient.deadline || ""}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            <button
              onClick={createClient}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Agregar Cliente
            </button>
          </div>

          {/* Lista de clientes */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Clientes</h2>
            {clients.map(client => (
              <div key={client.id} className="border rounded-lg p-4 mb-4">
                {editingClient && editingClient.id === client.id ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={editingClient.name || ""}
                      onChange={handleInputChange}
                      className="border p-2"
                    />
                    <input
                      name="identity_number"
                      value={editingClient.identity_number || ""}
                      onChange={handleInputChange}
                      className="border p-2"
                    />
                    {/* Agregar más campos aquí */}
                    <button
                      onClick={() => updateClient(client.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">Nombre: {client.name}</p>
                    <p>Número de Identidad: {client.identity_number}</p>
                    <p>Tipo de Identidad: {client.identity_type}</p>
                    <p>Dirección: {client.address}</p>
                    <p>Teléfono: {client.phone}</p>
                    <p>Ciudad: {client.city}</p>
                    <p>Fecha de Vencimiento: {client.due_date}</p>
                    <p>Tipo de Deuda: {client.debt_type}</p>
                    <p>Plazo: {client.deadline}</p>
                    <button
                      onClick={() => setEditingClient(client)}
                      className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
