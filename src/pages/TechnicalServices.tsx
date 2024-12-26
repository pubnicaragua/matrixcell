import React, { useState } from "react";

interface Service {
  id: number;
  client: string;
  serviceType: string;
  description: string;
  status: string;
  cost: number;
}

const TechnicalServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    client: "",
    serviceType: "",
    description: "",
    status: "Pendiente",
    cost: 0,
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  // Manejo de entradas
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: name === "cost" ? parseFloat(value) : value });
  };
  
  const validateService = () => {
    if (
      !newService.client ||
      !newService.serviceType ||
      !newService.description ||
      newService.cost <= 0
    ) {
      alert("Todos los campos son obligatorios y el costo debe ser mayor a 0.");
      return false;
    }
    return true;
  };

  // Agregar servicio
  const handleAddService = () => {
    if (validateService()) {
      const newServiceId = services.length + 1;
      setServices([...services, { id: newServiceId, ...newService }]);
      setNewService({ client: "", serviceType: "", description: "", status: "Pendiente", cost: 0 });
    }
  };

  // Edición
  const handleEditService = (service: Service) => {
    setEditingService(service);
  };

  const handleUpdateService = () => {
    if (editingService) {
      setServices(
        services.map((service) =>
          service.id === editingService.id ? editingService : service
        )
      );
      setEditingService(null);
    }
  };

  const handleDeleteService = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      setServices(services.filter((service) => service.id !== id));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleExportToCSV = () => {
    const csvHeader = "ID,Cliente,Tipo de Servicio,Descripción,Estado,Costo\n";
    const csvRows = services.map(
      (service) =>
        `${service.id},${service.client},${service.serviceType},${service.description},${service.status},${service.cost}`
    );
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "services.csv";
    link.click();
  };

  const filteredServices = services.filter(
    (service) =>
      service.client.toLowerCase().includes(search.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(search.toLowerCase()) ||
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#007BFF" }}>Servicios Técnicos</h1>

      {/* Búsqueda */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por cliente, tipo o descripción"
          value={search}
          onChange={handleSearch}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100%",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Formulario para agregar/editar servicios */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#007BFF" }}>
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
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="serviceType"
          placeholder="Tipo de Servicio"
          value={
            editingService ? editingService.serviceType : newService.serviceType
          }
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, serviceType: e.target.value })
              : handleInputChange(e)
          }
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={
            editingService ? editingService.description : newService.description
          }
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, description: e.target.value })
              : handleInputChange(e)
          }
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            height: "80px",
          }}
        />
        <select
          name="status"
          value={editingService ? editingService.status : newService.status}
          onChange={(e) =>
            editingService
              ? setEditingService({ ...editingService, status: e.target.value })
              : handleInputChange(e)
          }
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
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
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={editingService ? handleUpdateService : handleAddService}
          style={{
            background: editingService ? "#28a745" : "#007BFF",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          {editingService ? "Actualizar Servicio" : "Agregar Servicio"}
        </button>
      </div>

      {/* Lista de servicios */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ textAlign: "center", color: "#007BFF" }}>
          Lista de Servicios
        </h2>
        {currentServices.length === 0 ? (
          <p>No hay servicios técnicos registrados.</p>
        ) : (
          <div>
            {currentServices.map((service) => (
              <div
                key={service.id}
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ color: "#007BFF" }}>{service.client}</h3>
                <p>
                  <strong>Tipo de Servicio:</strong> {service.serviceType}
                </p>
                <p>
                  <strong>Descripción:</strong> {service.description}
                </p>
                <p>
                  <strong>Estado:</strong> {service.status}
                </p>
                <p>
                  <strong>Costo:</strong> ${service.cost.toFixed(2)}
                </p>
                <div>
                  <button
                    onClick={() => handleEditService(service)}
                    style={{
                      background: "#ffc107",
                      color: "white",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      marginRight: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exportar servicios */}
      <button
        onClick={handleExportToCSV}
        style={{
          marginTop: "20px",
          background: "#007BFF",
          color: "white",
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Exportar a CSV
      </button>
    </div>
  );
};

export default TechnicalServices;
