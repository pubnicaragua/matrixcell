import React, { useState } from 'react';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  permisos: string[];
}

const Users = () => {
  // Lista estática de usuarios de ejemplo
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      rol: 'manager',
      permisos: ['Ver dashboard', 'Editar usuarios', 'Crear reportes'],
    },
    {
      id: '2',
      nombre: 'Ana Gómez',
      email: 'ana.gomez@example.com',
      rol: 'tecnico',
      permisos: ['Ver dashboard', 'Manejar servicios técnicos'],
    },
    {
      id: '3',
      nombre: 'Carlos Martínez',
      email: 'carlos.martinez@example.com',
      rol: 'lector',
      permisos: ['Ver dashboard'],
    },
    {
      id: '4',
      nombre: 'Lucía Fernández',
      email: 'lucia.fernandez@example.com',
      rol: 'manager',
      permisos: ['Ver dashboard', 'Editar usuarios', 'Crear reportes', 'Manejar servicios técnicos'],
    },
    {
      id: '5',
      nombre: 'Pedro Sánchez',
      email: 'pedro.sanchez@example.com',
      rol: 'tecnico',
      permisos: ['Ver dashboard', 'Manejar servicios técnicos'],
    },
  ]);

  // Estados para el formulario de agregar usuario
  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    rol: 'lector', // Valor predeterminado
    permisos: ['Ver dashboard'],
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  // Opciones de roles
  const roles = ['manager', 'tecnico', 'lector'];
  // Opciones de permisos
  const permisosOptions = [
    'Ver dashboard',
    'Editar usuarios',
    'Crear reportes',
    'Manejar servicios técnicos',
  ];

  // Función para manejar el cambio en el formulario
  // Modificar la función handleInputChange para manejar diferentes tipos de elementos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setNewUser((prevState) => {
      const updatedPermissions = checked
        ? [...prevState.permisos, value]
        : prevState.permisos.filter((permiso) => permiso !== value);
      return { ...prevState, permisos: updatedPermissions };
    });
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = () => {
    const newUserData = { ...newUser, id: String(users.length + 1) };
    setUsers((prevUsers) => [...prevUsers, newUserData]);
    setIsFormVisible(false); // Ocultar el formulario después de agregar
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Gestión de Usuarios</h1>

      {/* Mostrar formulario de agregar usuario */}
      <div className="text-center mb-6">
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          {isFormVisible ? 'Cancelar' : 'Agregar Usuario'}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Nuevo Usuario</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={newUser.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Nombre del usuario"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Email del usuario"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rol:</label>
            <select
              name="rol"
              value={newUser.rol}
              onChange={handleInputChange}  // Ahora esta línea debería funcionar correctamente
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Permisos:</label>
            <div className="space-y-2">
              {permisosOptions.map((permiso) => (
                <div key={permiso} className="flex items-center">
                  <input
                    type="checkbox"
                    value={permiso}
                    checked={newUser.permisos.includes(permiso)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label>{permiso}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleAddUser}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
              Agregar Usuario
            </button>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Rol</th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Permisos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{user.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.rol}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <ul className="list-disc pl-5 space-y-1">
                    {user.permisos.map((permiso, index) => (
                      <li key={index}>{permiso}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
