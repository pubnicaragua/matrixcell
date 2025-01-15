'use client'

import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import jsPDF from "jspdf";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Search, Download, Filter, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import EditServiceModal from "./EditServiceModal";

interface Store {
  id: number;
  name: string;
}

interface Product {
  id: number;
  article: string;
}

interface Service {
  id: number;
  client: string;
  service_type: string;
  status: string;
  description: string;
  product_id: number;
  quantity: number;
  cost: number;
  store_id: number;
}

interface Inventory {
  id: number;
  store_id: number;
  product_id: number;
  stock: number;
  products: {
    id: number;
    article: string;
    price: number;
  };
  imei: string;
}

const ServiceListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, storesRes, productsRes, inventoriesRes] = await Promise.all([
          api.get("/technical_services"),
          api.get("/stores"),
          api.get("/products"),
          api.get("/inventories"),
        ]);
        setServices(servicesRes.data);
        setStores(storesRes.data);
        setProducts(productsRes.data);
        setInventories(inventoriesRes.data);
      } catch (err) {
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePDF = (service: Service) => {
    const doc = new jsPDF();

    const storeName = stores.find((store) => store.id === service.store_id)?.name || "N/A";
    const productName = products.find((product) => product.id === service.product_id)?.article || "N/A";

    doc.setFontSize(16);
    doc.text("Detalles del Servicio", 20, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${service.client}`, 20, 40);
    doc.text(`Tipo de Servicio: ${service.service_type}`, 20, 50);
    doc.text(`Estado: ${service.status}`, 20, 60);
    doc.text(`Descripción: ${service.description}`, 20, 70);
    doc.text(`Costo: $${service.cost.toFixed(2)}`, 20, 80);
    doc.text(`Cantidad: ${service.quantity}`, 20, 90);
    doc.text(`Producto: ${productName}`, 20, 100);
    doc.text(`Tienda: ${storeName}`, 20, 110);

    doc.save(`Servicio_${service.id}.pdf`);
  };

  const filteredServices = services.filter((service) => {
    const searchMatch = 
      service.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = !statusFilter || service.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleSaveService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
    setIsEditModalOpen(false);
  };

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Lista de Servicios</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2" size={20} />
              Filtrar por Estado
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Estados</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pendiente")}>Pendiente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("En Proceso")}>En Proceso</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Completado")}>Completado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const inventoryItem = inventories.find((inventory) => inventory.product_id === service.product_id);
          const productName = inventoryItem ? inventoryItem.products.article : "Producto no encontrado";
          const storeName = stores.find((store) => store.id === service.store_id)?.name || "Tienda no encontrada";

          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{service.client}</span>
                  <Badge variant={service.status === "Completado" ? "default" : "secondary"}>
                    {service.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Tipo:</strong> {service.service_type}</p>
                <p><strong>Descripción:</strong> {service.description}</p>
                <p><strong>Costo:</strong> ${service.cost.toFixed(2)}</p>
                <p><strong>Cantidad:</strong> {service.quantity}</p>
                <p><strong>Producto:</strong> {productName}</p>
                <p><strong>Tienda:</strong> {storeName}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => generatePDF(service)} variant="outline">
                  <Download className="mr-2" size={20} />
                  Descargar PDF
                </Button>
                <Button onClick={() => handleEditClick(service)} variant="outline">
                  <Edit className="mr-2" size={20} />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {isEditModalOpen && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
};

export default ServiceListPage;

