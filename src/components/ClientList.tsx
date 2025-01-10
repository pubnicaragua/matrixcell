'use client'

import React from 'react';
import axios from '../axiosConfig';
import { Client } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Trash2, Edit } from 'lucide-react'

interface ClientListProps {
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  fetchClientsAndOperations: () => Promise<void>;
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Lista de Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">{client.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <InfoItem label="Teléfono" value={client.phone} />
                <InfoItem label="Dirección" value={client.address} />
                <InfoItem label="Ciudad" value={client.city} />
                <InfoItem label="Tipo de Identificación" value={client.identity_type} />
                <InfoItem label="Número de Identificación" value={client.identity_number} />
                <InfoItem label="Fecha de Corte" value={client.due_date} />
                <InfoItem label="Fecha de Concesión" value={client.grant_date} />
                <InfoItem label="Tipo de Deudor" value={client.debt_type} />
                <InfoItem label="Plazo" value={`${client.deadline} meses`} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedClient(client)}
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => client.id && deleteClient(client.id)}
                className="flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{' '}
    <span className="text-gray-600">{value}</span>
  </p>
);

export default ClientsList;

