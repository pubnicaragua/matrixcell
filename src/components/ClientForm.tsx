// Importa los tipos necesarios
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';  // Importamos Axios
import { Client } from '../types';

interface ClientFormProps {
  clients: Client[];
  selectedClient: Client | null;
  fetchClientsAndOperations: () => Promise<void>;
}

const ClientForm: React.FC<ClientFormProps> = ({ clients, selectedClient, fetchClientsAndOperations }) => {
  const [name, setName] = useState(selectedClient?.name || '');
  const [phone, setPhone] = useState(selectedClient?.phone || '');
  const [address, setAddress] = useState(selectedClient?.address || '');
  const [city, setCity] = useState(selectedClient?.city || '');
  const [identityNumber, setIdentityNumber] = useState(selectedClient?.identity_number || '');
  const [identityType, setIdentityType] = useState(selectedClient?.identity_type || '');
  const [dueDate, setDueDate] = useState(selectedClient?.due_date || '');
  const [grantDate, setGrantDate] = useState(selectedClient?.grant_date || '');
  const [debtType, setDebtType] = useState(selectedClient?.debt_type || '');
  const [deadline, setDeadline] = useState(selectedClient?.deadline || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Creamos el objeto con los datos del formulario
    const clientData: Client = {
      name,
      phone,
      address,
      city,
      identity_number: identityNumber,
      identity_type: identityType,
      due_date: dueDate,
      grant_date: grantDate,
      debt_type: debtType,
      deadline: deadline,
    };

    try {
      if (selectedClient) {
        // Si estamos editando un cliente, hacemos PUT para actualizar
        await axios.put(`/clients/${selectedClient.id}`, clientData);
      } else {
        // Si estamos agregando un cliente, hacemos POST
        await axios.post('/clients', clientData);
      }

      // Una vez que se guarde, actualizamos la lista de clientes
      fetchClientsAndOperations();
    } catch (error) {
      console.error('Error al guardar el cliente', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {selectedClient ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="identity_number" className="block text-sm font-medium text-gray-700">Número de Identidad</label>
          <input id="identity_number" value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="identity_type" className="block text-sm font-medium text-gray-700">Tipo de Identidad</label>
          <input id="identity_type" placeholder='Solo Cédula' value={identityType} onChange={(e) => setIdentityType(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha de Corte</label>
          <input id="due_date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="grant_date" className="block text-sm font-medium text-gray-700">Fecha de Concesión</label>
          <input id="grant_date" type="date" value={grantDate} onChange={(e) => setGrantDate(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="debt_type" className="block text-sm font-medium text-gray-700">Tipo de Deuda</label>
          <input id="debt_type" value={debtType} onChange={(e) => setDebtType(e.target.value)} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Plazo (Meses)</label>
          <input id="deadline" type="number" value={deadline} onChange={(e) => setDeadline(Number(e.target.value))} required className="mt-1 p-2 w-full border rounded-lg" />
        </div>
      </div>

      <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        {selectedClient ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </button>
    </form>
  );
};

export default ClientForm;
