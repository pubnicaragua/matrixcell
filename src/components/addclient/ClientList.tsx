"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import type { Client, Store } from "../../types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Trash2, Edit, RefreshCw } from "lucide-react"
import Pagination from "../Pagination"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"

interface ClientListProps {
  clients: Client[]
  stores: Store[]
  setSelectedClient: (client: Client | null) => void
  fetchClientsAndOperations: () => Promise<void>
  softDeleteClient: (id: number) => Promise<void>
  restoreClient: (id: number) => Promise<void>
}

const ClientsList: React.FC<ClientListProps> = ({
  clients,
  stores,
  setSelectedClient,
  fetchClientsAndOperations,
  softDeleteClient,
  restoreClient,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleted, setShowDeleted] = useState(false)
  const itemsPerPage = 6

  const [userRole, setUserRole] = useState<number>(0);
  const [userStore, setUserStore] = useState<number | null>(null);

  useEffect(() => {
    const perfil = localStorage.getItem("perfil");
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil);
      setUserRole(parsedPerfil.rol_id || 0);
      setUserStore(parsedPerfil.store_id || null);
    }
  }, []);

  const filteredClients = useMemo(() => {
    return clients
      .filter(client => {
        // ✅ Si es admin, ve todos los clientes
        if (userRole === 1) return true;
        // ✅ Si no es admin, solo ve los clientes de su tienda asignada
        return client.store_id === userStore;
      })
      .filter(client => {
        // ✅ Filtra por nombre o número de identificación
        return (
          (client.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (client.identity_number?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
      })
      .filter(client => {
        // ✅ Filtra clientes eliminados o no eliminados según `showDeleted`
        return showDeleted ? client.deleted : !client.deleted;
      });
  }, [clients, userRole, userStore, searchTerm, showDeleted]);


  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredClients.slice(startIndex, endIndex)
  }, [filteredClients, currentPage])

  const getStoreName = (storeId: number) => {
    const store = stores.find((store) => store.id === storeId);
    return store ? store.name : 'Desconocido';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSoftDelete = async (id: number) => {
    await softDeleteClient(id)
    await fetchClientsAndOperations()
  }

  const handleRestore = async (id: number) => {
    await restoreClient(id)
    await fetchClientsAndOperations()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Lista de Clientes</h2>

      <div className="py-2">
        <h2>Total de clientes: {clients.length}</h2>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Switch id="show-deleted" checked={showDeleted} onCheckedChange={setShowDeleted} />
        <Label htmlFor="show-deleted">Mostrar clientes eliminados</Label>
      </div>

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
                <InfoItem label="Correo" value={client.email} />
                <InfoItem label="Teléfono" value={client.phone} />
                <InfoItem label="Número de Identificación" value={client.identity_number} />
                <InfoItem label="Ciudad" value={client.city} />
                <InfoItem label="Plazo" value={client.deadline ? `${client.deadline} meses` : "No hay plazo"} />
                <InfoItem label="Tienda" value={getStoreName(client.store_id)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {client.deleted ? (
                <Button
                  variant="outline"
                  onClick={() => client.id && handleRestore(client.id)}
                  className="flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restaurar
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSelectedClient(client)} className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => client.id && handleSoftDelete(client.id)}
                    className="flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Enviar a papelera
                  </Button>
                </>
              )}
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
  )
}

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-medium text-gray-700">{label}:</span> <span className="text-gray-600">{value}</span>
  </p>
)

export default ClientsList

