import React, { useState, useEffect } from 'react';
import axiosConfig from '../axiosConfig'

interface Perfil {
  nombre: string;
  email: string;
  rol: string;
  permisos: string[];
}

const Profile = () => {
  // Estado para almacenar los datos del perfil
  const [perfilData, setPerfilData] = useState<Perfil | null>(null);

  useEffect(() => {
    // Recuperamos los datos del localStorage
    const perfil = localStorage.getItem('perfil');
    const usuario = localStorage.getItem('usuario');
    const permisos = localStorage.getItem('permisos');

    // Si los datos existen, los parseamos y actualizamos el estado
    if (perfil && usuario && permisos) {
      const parsedPerfil = JSON.parse(perfil);
      const parsedUsuario = JSON.parse(usuario);
      const parsedPermisos = JSON.parse(permisos);

      setPerfilData({
        nombre: parsedPerfil.name,
        email: parsedUsuario.email,
        rol: parsedPerfil.roles.name,
        permisos: parsedPermisos,  // Asegúrate de que 'permisos' es un array de strings
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Mi Perfil</h1>

      {/* Mostrar la información del perfil */}
      {perfilData ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perfil de {perfilData.nombre}</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-600">{perfilData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Rol:</span>
              <span className="text-gray-600">{perfilData.rol}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Permisos:</span>
              <span className="text-gray-600">{perfilData.permisos.join(', ')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>Cargando información del perfil...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
