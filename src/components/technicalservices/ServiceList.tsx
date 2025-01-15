import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import EditServiceModal from "./EditServiceModal";

interface Service {
  id: number;
  client: string;
  serviceType: string;
  status: string;
  description: string;
  product_id: number;
  quantity: number;
  cost: number;
  store_id: number;
}

const ServiceListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/technical_services");
        setServices(response.data);
      } catch (err) {
        setError("Error al obtener los servicios.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este servicio?")) {
      try {
        await api.delete(`/technicalservices/${id}`);
        setServices((prev) => prev.filter((service) => service.id !== id));
        alert("Servicio eliminado con éxito.");
      } catch {
        alert("Error al eliminar el servicio.");
      }
    }
  };

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lista de Servicios</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Cliente</th>
            <th className="border px-4 py-2">Tipo de Servicio</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{service.client}</td>
              <td className="border px-4 py-2">{service.serviceType}</td>
              <td className="border px-4 py-2">{service.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditServiceModal
          service={selectedService}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          onSave={(updatedService) => {
            setServices((prev) =>
              prev.map((s) => (s.id === updatedService.id ? updatedService : s))
            );
            setIsModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default ServiceListPage;
