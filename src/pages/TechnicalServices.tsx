import React, { useEffect, useState } from "react";
import api from "../axiosConfig"; // Importa la configuración de axios

interface Service {
  id: number;
  client: string;
  service_type: string;
  description: string;
  status: string;
  cost: number;
  store_id: string;
}

const TechnicalServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    client: "",
    service_type: "",
    description: "",
    status: "Pendiente",
    cost: 0,
    store_id: "",
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("http://localhost:5000/technical_services");
        setServices(response.data);
      } catch (err: any) {
        setError(err.message || "Error fetching services");
      } finally {
        setLoading(false);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await api.get("http://localhost:5000/stores");
        setStores(response.data);
      } catch (err: any) {
        alert("Error al cargar las tiendas: " + err.message);
      }
    };

    fetchServices();
    fetchStores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: name === "cost" ? parseFloat(value) : value });
  };

  const validateService = () => {
    if (
      !newService.client ||
      !newService.service_type ||
      !newService.description ||
      newService.cost <= 0 ||
      !newService.store_id
    ) {
      alert("Todos los campos son obligatorios, el costo debe ser mayor a 0 y debe seleccionar una tienda.");
      return false;
    }
    return true;
  };

  const handleAddService = async () => {
    if (validateService()) {
      try {
        const response = await api.post("http://localhost:5000/technical_services", newService);
        setServices([...services, response.data]);
        setNewService({ client: "", service_type: "", description: "", status: "Pendiente", cost: 0, store_id: "" });
      } catch (err: any) {
        alert("Error al agregar el servicio: " + err.message);
      }
    }
  };

  const handleUpdateService = async () => {
    if (editingService) {
      try {
        const response = await api.put(
          `http://localhost:5000/technical_services/${editingService.id}`,
          editingService
        );
        setServices(
          services.map((service) =>
            service.id === editingService.id ? response.data : service
          )
        );
        setEditingService(null);
      } catch (err: any) {
        alert("Error al actualizar el servicio: " + err.message);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredServices = services.filter(
    (service) =>
      service.client.toLowerCase().includes(search.toLowerCase()) ||
      service.service_type.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">Servicios Técnicos</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente, tipo o descripción"
          value={search}
          onChange={handleSearch}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl text-blue-500 font-semibold mb-4">
          {editingService ? "Editar Servicio" : "Agregar Servicio"}
        </h2>
        <input
          type="text"
          name="client"
          placeholder="Cliente"
          value={editingService ? editingService.client : newService.client}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, client: e.target.value })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        />
        <input
          type="text"
          name="service_type"
          placeholder="Tipo de Servicio"
          value={editingService ? editingService.service_type : newService.service_type}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, service_type: e.target.value })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={editingService ? editingService.description : newService.description}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, description: e.target.value })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        ></textarea>
        <select
          name="status"
          value={editingService ? editingService.status : newService.status}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, status: e.target.value })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
        </select>
        <input
          type="number"
          name="cost"
          placeholder="Costo"
          value={editingService ? editingService.cost : newService.cost}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, cost: parseFloat(e.target.value) })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        />
        <select
          name="store_id"
          value={editingService ? editingService.store_id : newService.store_id}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, store_id: e.target.value })
              : handleInputChange(e)
          }
          className="block w-full p-3 rounded-lg border border-gray-300 mb-4"
        >
          <option value="">Seleccionar tienda</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        <button
          onClick={editingService ? handleUpdateService : handleAddService}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${editingService ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {editingService ? "Actualizar Servicio" : "Agregar Servicio"}
        </button>
      </div>

      <div>
        {loading ? (
          <p className="text-center">Cargando servicios...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : currentServices.length === 0 ? (
          <p className="text-center">No hay servicios técnicos registrados.</p>
        ) : (
          <div>
            {currentServices.map((service) => (
              <div
                key={service.id}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <h3 className="text-xl text-blue-500 font-bold mb-2">{service.client}</h3>
                <p><strong>Tipo de Servicio:</strong> {service.service_type}</p>
                <p><strong>Descripción:</strong> {service.description}</p>
                <p><strong>Estado:</strong> {service.status}</p>
                <p><strong>Costo:</strong> {service.cost} $</p>
                <p><strong>Tienda:</strong> {stores.find((store) => store.id === service.store_id)?.name || "Desconocida"}</p>
                <button
                  onClick={() => setEditingService(service)}
                  className="mt-4 text-blue-500 hover:text-blue-600"
                >
                  Editar
                </button>
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={currentPage * servicesPerPage >= filteredServices.length}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalServices;
