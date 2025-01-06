import React from "react";
import { useStore } from "./StoreContext";

// Definición de la interfaz Store
interface Store {
  id: number;
  name: string;
  address?: string; // Cambiado a opcional
  phone?: string;   // Cambiado a opcional
}

// Definición del tipo del contexto
interface StoreContextType {
  activeStore: Store | null;
  setActiveStore: (store: Store) => void;
  stores: Store[]; // Se asegura que `stores` existe en el contexto
}

// Componente StoreSelector
const StoreSelector: React.FC = () => {
  const { activeStore, setActiveStore, stores } = useStore() as StoreContextType;

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStore = stores.find(
      (store) => store.id === parseInt(e.target.value, 10)
    );
    if (selectedStore) {
      setActiveStore(selectedStore);
    }
  };

  return (
    <div style={styles.container}>
      <label htmlFor="store-selector" style={styles.label}>
        Selecciona una tienda:
      </label>
      <select
        id="store-selector"
        onChange={handleStoreChange}
        value={activeStore?.id || ""}
        style={styles.select}
      >
        <option value="">Selecciona una tienda</option>
        {stores.length > 0 ? (
          stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No hay tiendas disponibles
          </option>
        )}
      </select>
      {activeStore && (
        <div style={styles.storeDetails}>
          <h3 style={styles.storeName}>{activeStore.name}</h3>
          {activeStore.address ? (
            <p>
              <strong>Dirección:</strong> {activeStore.address}
            </p>
          ) : (
            <p>Dirección no disponible</p>
          )}
          {activeStore.phone ? (
            <p>
              <strong>Teléfono:</strong> {activeStore.phone}
            </p>
          ) : (
            <p>Teléfono no disponible</p>
          )}
        </div>
      )}
    </div>
  );
};

// Estilos
const styles = {
  container: {
    margin: "20px 0",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "16px",
  },
  storeDetails: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  storeName: {
    margin: 0,
    fontSize: "18px",
    color: "#007BFF",
  },
};

export default StoreSelector;
