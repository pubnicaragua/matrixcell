import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStore, setNewStore] = useState<Omit<Store, "id" | "active">>({
    name: "",
    address: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const validateStore = () => {
    if (!newStore.name || !newStore.address || !newStore.phone) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  const handleAddStore = () => {
    if (validateStore()) {
      const newStoreId = stores.length + 1;
      setStores([...stores, { id: newStoreId, ...newStore, active: true }]);
      setNewStore({ name: "", address: "", phone: "" });
    }
  };

  const handleEditStore = (store: Store) => {
    setEditing(true);
    setCurrentStore(store);
  };

  const handleUpdateStore = () => {
    if (currentStore) {
      setStores(
        stores.map((store) =>
          store.id === currentStore.id ? { ...currentStore } : store
        )
      );
      setEditing(false);
      setCurrentStore(null);
    }
  };

  const handleDeleteStore = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta tienda?")) {
      setStores(stores.filter((store) => store.id !== id));
    }
  };

  const handleToggleStore = (id: number) => {
    setStores(
      stores.map((store) =>
        store.id === id ? { ...store, active: !store.active } : store
      )
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleExportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(stores);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stores");
    XLSX.writeFile(wb, "stores.xlsx");
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Tiendas", 10, 10);
    let y = 20;
    stores.forEach((store) => {
      doc.text(
        `${store.id}. ${store.name} - ${store.address} - ${store.phone} - ${
          store.active ? "Activo" : "Inactivo"
        }`,
        10,
        y
      );
      y += 10;
    });
    doc.save("stores.pdf");
  };

  // Paginación y Filtro
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase()) ||
      store.phone.includes(search)
  );
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(
    indexOfFirstStore,
    indexOfLastStore
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div style={styles.container}>
<h1 style={{ ...styles.title, textAlign: "center" as const }}>Gestión de Tiendas</h1>

      {/* Búsqueda */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o teléfono"
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Exportar */}
      <div style={styles.exportContainer}>
        <button onClick={handleExportToXLSX} style={styles.exportButton}>
          Exportar a XLSX
        </button>
        <button onClick={handleExportToPDF} style={styles.exportButton}>
          Exportar a PDF
        </button>
      </div>

      {/* Formulario */}
      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>
          {editing ? "Editar Tienda" : "Agregar Tienda"}
        </h2>
        <input
          type="text"
          name="name"
          value={newStore.name}
          onChange={handleInputChange}
          placeholder="Nombre de la tienda"
          style={styles.input}
        />
        <input
          type="text"
          name="address"
          value={newStore.address}
          onChange={handleInputChange}
          placeholder="Dirección"
          style={styles.input}
        />
        <input
          type="text"
          name="phone"
          value={newStore.phone}
          onChange={handleInputChange}
          placeholder="Teléfono"
          style={styles.input}
        />
        <button
          onClick={editing ? handleUpdateStore : handleAddStore}
          style={styles.addButton}
        >
          {editing ? "Actualizar Tienda" : "Agregar Tienda"}
        </button>
      </div>

      {/* Lista */}
      <div style={styles.listContainer}>
        <h2 style={styles.subtitle}>Lista de Tiendas</h2>
        {currentStores.length === 0 ? (
          <p>No hay tiendas registradas.</p>
        ) : (
        <table style={{ ...styles.table, borderCollapse: "collapse" as const }}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Dirección</th>
                <th style={styles.tableHeader}>Teléfono</th>
                <th style={styles.tableHeader}>Estado</th>
                <th style={styles.tableHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentStores.map((store) => (
                <tr key={store.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{store.name}</td>
                  <td style={styles.tableCell}>{store.address}</td>
                  <td style={styles.tableCell}>{store.phone}</td>
                  <td style={styles.tableCell}>
                    {store.active ? "Activo" : "Inactivo"}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleToggleStore(store.id)}
                      style={styles.toggleButton}
                    >
                      {store.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => handleEditStore(store)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id)}
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
        {Array.from({ length: Math.ceil(filteredStores.length / storesPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            style={{
              ...styles.paginationButton,
              backgroundColor: currentPage === i + 1 ? "#007BFF" : "#f1f1f1",
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
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  title: { textAlign: "center", marginBottom: "20px", color: "#007BFF" },
  searchContainer: { marginBottom: "20px" },
  searchInput: { padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" },
  exportContainer: { marginBottom: "20px", display: "flex", gap: "10px" },
  exportButton: { padding: "10px", backgroundColor: "#007BFF", color: "white", borderRadius: "4px", border: "none", cursor: "pointer" },
  formContainer: { marginBottom: "30px", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" },
  subtitle: { marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#333" },
  input: { display: "block", marginBottom: "10px", padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" },
  addButton: { padding: "10px", backgroundColor: "#28a745", color: "white", borderRadius: "4px", border: "none", cursor: "pointer" },
  listContainer: { marginBottom: "30px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { padding: "10px", backgroundColor: "#007BFF", color: "white", textAlign: "left" as const },
  tableRow: { borderBottom: "1px solid #ddd" },
  tableCell: { padding: "10px" },
  toggleButton: { marginRight: "5px", padding: "5px 10px", borderRadius: "4px", backgroundColor: "#ffc107", border: "none", cursor: "pointer" },
  editButton: { marginRight: "5px", padding: "5px 10px", borderRadius: "4px", backgroundColor: "#007BFF", border: "none", cursor: "pointer" },
  deleteButton: { padding: "5px 10px", borderRadius: "4px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" },
  pagination: { display: "flex", justifyContent: "center", marginTop: "20px" },
  paginationButton: { margin: "0 5px", padding: "5px 10px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" },
};

export default Stores;
