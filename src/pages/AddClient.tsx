import React, { useState } from "react";
import { saveAs } from "file-saver";

const AddClient = () => {
  const [clients, setClients] = useState<
    { id: number; name: string; email: string; phone: string; address: string; category: string; status: string }[]
  >([]);
  const [currentClient, setCurrentClient] = useState<
    { id?: number; name: string; email: string; phone: string; address: string; category: string; status: string }
  >({ name: "", email: "", phone: "", address: "", category: "Individual", status: "Activo" });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;

  const categories = ["Individual", "Empresa", "VIP"];
  const statuses = ["Activo", "Inactivo"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentClient({ ...currentClient, [name]: value });
  };

  const validateForm = () => {
    if (
      !currentClient.name ||
      !currentClient.email ||
      !currentClient.phone ||
      !currentClient.address ||
      !currentClient.category ||
      !currentClient.status
    ) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(currentClient.email)) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    if (!/^\d{10}$/.test(currentClient.phone)) {
      setError("El número de teléfono debe contener 10 dígitos.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddClient = () => {
    if (validateForm()) {
      const newClientId = clients.length + 1;
      setClients([...clients, { id: newClientId, ...currentClient }]);
      setCurrentClient({ name: "", email: "", phone: "", address: "", category: "Individual", status: "Activo" });
      alert("Cliente agregado exitosamente.");
    }
  };

  const handleEditClient = (client: typeof currentClient) => {
    setEditing(true);
    setCurrentClient(client);
  };

  const handleUpdateClient = () => {
    if (validateForm()) {
      setClients(
        clients.map((client) =>
          client.id === currentClient.id ? { ...currentClient, id: client.id } : client
        )
      );
      setEditing(false);
      setCurrentClient({ name: "", email: "", phone: "", address: "", category: "Individual", status: "Activo" });
      alert("Cliente actualizado exitosamente.");
    }
  };

  const handleDeleteClient = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      setClients(clients.filter((client) => client.id !== id));
      alert("Cliente eliminado exitosamente.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleExportClients = () => {
    const csvHeader = "ID,Nombre,Correo,Teléfono,Dirección,Categoría,Estado\n";
    const csvRows = clients.map(
      (client) =>
        `${client.id},${client.name},${client.email},${client.phone},${client.address},${client.category},${client.status}`
    );
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "clientes.csv");
  };

  const handleImportClients = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        const rows = csvData.split("\n").slice(1);
        const newClients = rows.map((row) => {
          const [id, name, email, phone, address, category, status] = row.split(",");
          return { id: parseInt(id), name, email, phone, address, category, status };
        });
        setClients((prev) => [...prev, ...newClients]);
      };
      reader.readAsText(file);
    }
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients
    .filter((client) =>
      [client.name, client.email].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    .slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>Gestión de Clientes</h1>
      {/* Formulario */}
      <div style={styles.formContainer}>
        <h2 style={{ fontFamily: "var(--font-primary)", color: "var(--color-secondary)" }}>
          {editing ? "Editar Cliente" : "Agregar Cliente"}
        </h2>
        <form>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentClient.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={currentClient.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={styles.label}>Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={currentClient.phone}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={currentClient.address}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="category" style={styles.label}>Categoría</label>
            <select
              id="category"
              name="category"
              value={currentClient.category}
              onChange={handleInputChange}
              style={styles.input}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="status" style={styles.label}>Estado</label>
            <select
              id="status"
              name="status"
              value={currentClient.status}
              onChange={handleInputChange}
              style={styles.input}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="button"
            onClick={editing ? handleUpdateClient : handleAddClient}
            style={styles.addButton}
          >
            {editing ? "Actualizar Cliente" : "Agregar Cliente"}
          </button>
        </form>
      </div>

      {/* Exportar e Importar */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={handleExportClients} style={styles.exportButton}>
          Exportar Clientes
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportClients}
          style={styles.fileInput}
        />
      </div>

      {/* Búsqueda */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Lista de Clientes */}
      <div style={styles.clientListContainer}>
        <h2 style={{ fontFamily: "var(--font-primary)", color: "var(--color-secondary)" }}>
          Lista de Clientes
        </h2>
        {currentClients.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Correo Electrónico</th>
                <th style={styles.tableHeader}>Teléfono</th>
                <th style={styles.tableHeader}>Dirección</th>
                <th style={styles.tableHeader}>Categoría</th>
                <th style={styles.tableHeader}>Estado</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr key={client.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{client.name}</td>
                  <td style={styles.tableCell}>{client.email}</td>
                  <td style={styles.tableCell}>{client.phone}</td>
                  <td style={styles.tableCell}>{client.address}</td>
                  <td style={styles.tableCell}>{client.category}</td>
                  <td style={styles.tableCell}>{client.status}</td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleEditClient(client)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id!)}
                      style={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      <div style={styles.pagination}>
        {Array.from({ length: Math.ceil(clients.length / clientsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            style={{
              ...styles.paginationButton,
              backgroundColor: currentPage === i + 1 ? "var(--color-primary)" : "#ccc",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


const styles = {
  formContainer: {
    marginTop: "20px",
    padding: "20px",
    background: "var(--color-white)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  addButton: {
    background: "var(--color-primary)",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  clientListContainer: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHeaderRow: {
    background: "var(--color-secondary)",
    color: "var(--color-white)",
  },
  tableHeader: {
    padding: "10px",
    textAlign: "left" as const,
  },
  tableRow: {
    borderBottom: "1px solid var(--color-background)",
  },
  tableCell: {
    padding: "10px",
  },
  editButton: {
    background: "var(--color-secondary)",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    marginRight: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "red",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
    exportButton: {
    background: "var(--color-primary)",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  paginationButton: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AddClient;
