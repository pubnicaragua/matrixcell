import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  nombre: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el token de acceso del almacenamiento (localStorage o donde lo tengas)
  const accessToken = localStorage.getItem('access_token') || '';

  // Función para obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores
    try {
      if (!accessToken) {
        throw new Error('Access token is missing');
      }
      // Asegúrate de pasar el token en el encabezado Authorization
      const response = await axios.get('http://localhost:5000/usuarios', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
        },
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      setError(error.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = async () => {
    const newUser = { nombre: 'Nuevo Usuario', email: 'nuevo@correo.com' };
    try {
      if (!accessToken) {
        setError('No tienes acceso. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }
      await axios.post(
        'http://localhost:5000/usuarios', // Endpoint de la API para agregar usuarios
        newUser,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // También pasas el token
          },
        }
      );
      fetchUsers(); // Refrescar la lista de usuarios
    } catch (error: any) {
      console.error('Error al agregar usuario:', error);
      setError(error.message || 'No se pudo agregar el usuario.');
    }
  };

  // Función para actualizar un usuario
  const handleUpdateUser = async (id: string) => {
    const updatedData = { nombre: 'Usuario Actualizado' };
    try {
      if (!accessToken) {
        setError('No tienes acceso. Por favor, inicia sesión.');
        return;
      }
      await axios.put(
        `http://localhost:5000/usuarios/${id}`, // Endpoint de la API para actualizar usuarios
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pasar el token también
          },
        }
      );
      fetchUsers(); // Refrescar la lista de usuarios
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      setError(error.message || 'No se pudo actualizar el usuario.');
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id: string) => {
    try {
      if (!accessToken) {
        setError('No tienes acceso. Por favor, inicia sesión.');
        return;
      }
      await axios.delete(`http://localhost:5000/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pasar el token para autenticación
        },
      });
      fetchUsers(); // Refrescar la lista de usuarios
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      setError(error.message || 'No se pudo eliminar el usuario.');
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []); // Este efecto solo se ejecuta una vez al cargar el componente

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Gestión de Usuarios</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleUpdateUser(user.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-center mt-6">
        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Agregar Usuario
        </button>
      </div>
    </div>
  );
};

export default Users;
