import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}

const StoreList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [newStore, setNewStore] = useState<Omit<Store, 'id'>>({
    name: '',
    address: '',
    phone: '',
    active: true,
  });
  const [editStore, setEditStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stores');
        setStores(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError('Error al obtener las tiendas: ' + err.message);
        } else {
          setError('Error desconocido');
        }
      }
    };

    fetchStores();
  }, []);

  // Filtrar tiendas por nombre
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Manejar cambio en el formulario de nueva tienda
  const handleNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewStore((prevStore) => ({
      ...prevStore,
      [name]: value,
    }));
  };

  // Manejar cambios en el formulario de edición
  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editStore) {
      const { name, value } = event.target;
      setEditStore({ ...editStore, [name]: value });
    }
  };

  // Agregar una nueva tienda
  const handleAddStore = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/stores', newStore);
      setStores((prevStores) => [...prevStores, response.data]);
      setNewStore({ name: '', address: '', phone: '', active: true });
    } catch (err: unknown) {
      setError('Error al agregar tienda: ' + (err instanceof Error ? err.message : 'Desconocido'));
    }
  };

  // Editar tienda
  const handleEditStore = (store: Store) => {
    setEditStore(store);
  };

  const handleUpdateStore = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editStore) {
      try {
        await axios.put(`http://localhost:5000/stores/${editStore.id}`, editStore);
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === editStore.id ? editStore : store
          )
        );
        setEditStore(null);
      } catch (err: unknown) {
        setError('Error al actualizar la tienda: ' + (err instanceof Error ? err.message : 'Desconocido'));
      }
    }
  };

  // Actualizar estado activo/inactivo
  const handleToggleActive = async (id: number) => {
    const store = stores.find((s) => s.id === id);
    if (store) {
      try {
        const updatedStore = { ...store, active: !store.active };
        await axios.put(`http://localhost:5000/stores/${id}`, updatedStore);
        setStores((prevStores) =>
          prevStores.map((s) => (s.id === id ? updatedStore : s))
        );
      } catch (err: unknown) {
        setError('Error al actualizar estado: ' + (err instanceof Error ? err.message : 'Desconocido'));
      }
    }
  };

  // Eliminar tienda
  const handleDeleteStore = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta tienda?')) {
      try {
        await axios.delete(`http://localhost:5000/stores/${id}`);
        setStores((prevStores) => prevStores.filter((store) => store.id !== id));
      } catch (err: unknown) {
        setError('Error al eliminar la tienda: ' + (err instanceof Error ? err.message : 'Desconocido'));
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Lista de Tiendas</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
          placeholder="Buscar tienda..."
        />
      </div>

      <form onSubmit={handleAddStore} className="mb-4 border p-4 rounded">
        <h2 className="text-2xl mb-2">Agregar Nueva Tienda</h2>
        <input
          type="text"
          name="name"
          value={newStore.name}
          onChange={handleNewInputChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Nombre de la tienda"
        />
        <input
          type="text"
          name="address"
          value={newStore.address}
          onChange={handleNewInputChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Dirección"
        />
        <input
          type="text"
          name="phone"
          value={newStore.phone}
          onChange={handleNewInputChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Teléfono"
        />
        <button type="submit" className="bg-teal-500 text-white p-2 rounded">
          Agregar Tienda
        </button>
      </form>

      {editStore && (
        <form onSubmit={handleUpdateStore} className="mb-4 border p-4 rounded">
          <h2 className="text-2xl mb-2">Editar Tienda</h2>
          <input
            type="text"
            name="name"
            value={editStore.name}
            onChange={handleEditInputChange}
            className="border p-2 rounded w-full mb-2"
            placeholder="Nombre de la tienda"
          />
          <input
            type="text"
            name="address"
            value={editStore.address}
            onChange={handleEditInputChange}
            className="border p-2 rounded w-full mb-2"
            placeholder="Dirección"
          />
          <input
            type="text"
            name="phone"
            value={editStore.phone}
            onChange={handleEditInputChange}
            className="border p-2 rounded w-full mb-2"
            placeholder="Teléfono"
          />
          <button type="submit" className="bg-teal-500 text-white p-2 rounded">
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => setEditStore(null)}
            className="bg-red-500 text-white p-2 rounded ml-4"
          >
            Cancelar
          </button>
        </form>
      )}

      {filteredStores.length === 0 ? (
        <p>No se encontraron tiendas.</p>
      ) : (
        <ul className="space-y-4">
          {filteredStores.map((store) => (
            <li key={store.id} className="border p-4 rounded shadow-md">
              <strong className="text-xl">{store.name}</strong><br />
              Dirección: {store.address}<br />
              Teléfono: {store.phone}<br />
              Estado: {store.active ? 'Activo' : 'Inactivo'}
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEditStore(store)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(store.id)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  {store.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDeleteStore(store.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StoreList;
