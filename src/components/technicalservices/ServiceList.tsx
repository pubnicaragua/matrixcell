import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import jsPDF from "jspdf";

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

  const generatePDF = (service: Service) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Detalles del Servicio", 20, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${service.client}`, 20, 40);
    doc.text(`Tipo de Servicio: ${service.serviceType}`, 20, 50);
    doc.text(`Estado: ${service.status}`, 20, 60);
    doc.text(`Descripción: ${service.description}`, 20, 70);
    doc.text(`Costo: $${service.cost.toFixed(2)}`, 20, 80);
    doc.text(`Cantidad: ${service.quantity}`, 20, 90);
    doc.text(`ID del Producto: ${service.product_id}`, 20, 100);
    doc.text(`ID de la Tienda: ${service.store_id}`, 20, 110);

    doc.save(`Servicio_${service.id}.pdf`);
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
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Costo</th>
            <th className="border px-4 py-2">Cantidad</th>
            <th className="border px-4 py-2">Producto</th>
            <th className="border px-4 py-2">Tienda</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{service.client}</td>
              <td className="border px-4 py-2">{service.serviceType}</td>
              <td className="border px-4 py-2">{service.status}</td>
              <td className="border px-4 py-2">{service.description}</td>
              <td className="border px-4 py-2">${service.cost.toFixed(2)}</td>
              <td className="border px-4 py-2">{service.quantity}</td>
              <td className="border px-4 py-2">{service.product_id}</td>
              <td className="border px-4 py-2">{service.store_id}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => generatePDF(service)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                >
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceListPage;
