"use client"

import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
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
  const [userRole, setUserRole] = useState<number>(0);

  useEffect(() => {
    fetchStores();
    getUserRole();
  }, []);

  const getUserRole = () => {
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
    }
  };

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error al obtener las tiendas: ' + err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };

  // Filtrar tiendas por nombre
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewStore((prevStore) => ({
      ...prevStore,
      [name]: value,
    }));
  };

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editStore) {
      const { name, value } = event.target;
      setEditStore({ ...editStore, [name]: value });
    }
  };

  const handleAddStore = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userRole !== 1) {
      alert("No tienes permisos para agregar tiendas.");
      return;
    }
    try {
      const response = await api.post('/stores', newStore);
      setStores((prevStores) => [...prevStores, response.data]);
      setNewStore({ name: '', address: '', phone: '', active: true });
    } catch (err: unknown) {
      setError('Error al agregar tienda: ' + (err instanceof Error ? err.message : 'Desconocido'));
    }
  };

  const handleEditStore = (store: Store) => {
    if (userRole !== 1) {
      alert("No tienes permisos para editar tiendas.");
      return;
    }
    setEditStore(store);
  };

  const handleUpdateStore = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userRole !== 1) {
      alert("No tienes permisos para actualizar tiendas.");
      return;
    }
    if (editStore) {
      try {
        await api.put(`/stores/${editStore.id}`, editStore);
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

  const handleToggleActive = async (id: number) => {
    if (userRole !== 1) {
      alert("No tienes permisos para cambiar el estado de las tiendas.");
      return;
    }
    const store = stores.find((s) => s.id === id);
    if (store) {
      try {
        const updatedStore = { ...store, active: !store.active };
        await api.put(`/stores/${id}`, updatedStore);
        setStores((prevStores) =>
          prevStores.map((s) => (s.id === id ? updatedStore : s))
        );
      } catch (err: unknown) {
        setError('Error al actualizar estado: ' + (err instanceof Error ? err.message : 'Desconocido'));
      }
    }
  };

  const handleDeleteStore = async (id: number) => {
    if (userRole !== 1) {
      alert("No tienes permisos para eliminar tiendas.");
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar esta tienda?')) {
      try {
        await api.delete(`/stores/${id}`);
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

      {userRole === 1 && (
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
      )}

      {editStore && userRole === 1 && (
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
              {userRole === 1 && (
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
              )}
            </li>
          ))}
        </ul>
      )}

      {userRole !== 1 && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Necesitas permisos de administrador para gestionar tiendas.</p>
        </div>
      )}
    </div>
  );
};

export default StoreList;
