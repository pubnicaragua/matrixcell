import React from 'react';

const Profile: React.FC = () => {
  // Datos de ejemplo (puedes modificar estos valores con los datos reales cuando los tengas disponibles)
  const user = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Administrador',
    permissions: ['Acceso completo', 'Gestión de usuarios', 'Gestión de facturas'],
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Perfil del Usuario</h2>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg text-gray-700">Nombre:</span>
          <p className="text-gray-600">{user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg text-gray-700">Correo Electrónico:</span>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg text-gray-700">Rol:</span>
          <p className="text-gray-600">{user.role}</p>
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-700">Permisos:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            {user.permissions.map((permission, index) => (
              <li key={index}>{permission}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <button className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default Profile;
