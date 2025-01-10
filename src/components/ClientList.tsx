'use client';

import React, { useState, useMemo } from 'react';
import axios from '../axiosConfig';
import { Client } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2, Edit } from 'lucide-react';
import Pagination from './Pagination'; // Importar componente reutilizable

interface ClientListProps {
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  fetchClientsAndOperations: () => Promise<void>;
}

const ClientsList: React.FC<ClientListProps> = ({ clients, setSelectedClient, fetchClientsAndOperations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.identity_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);
  

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Lista de Clientes</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o número de cédula"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-6 p-2 w-full border rounded-lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedClients.map((client) => (
          <Card key={client.id} className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">{client.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <InfoItem label="Teléfono" value={client.phone} />
                <InfoItem label="Número de Identificación" value={client.identity_number} />
                <InfoItem label="Ciudad" value={client.city} />
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

      <Pagination
        totalItems={filteredClients.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
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
