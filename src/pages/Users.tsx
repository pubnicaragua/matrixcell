import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  perfil?: {
    name: string;
    roles: {
      name: string;
    };
    rol_id: number;
    permisos: string[];
  };
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    rol_id: '',
    password: '', // Nuevo campo para la contraseña
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
      console.log('Usuarios obtenidos:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        rol_id: parseInt(formData.rol_id),
        ...(isEditing ? {} : { password: formData.password }), // Solo agregar contraseña al crear
      };
  
      console.log('Payload enviado:', payload);
  
      if (isEditing) {
        await api.put(`/usuarios/${formData.id}`, payload);
        alert('Usuario actualizado exitosamente.');
      } else {
        await api.post('/usuarios', payload);
        alert('Usuario creado exitosamente.');
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.perfil?.name || '',
      email: user.email,
      rol_id: user.perfil?.rol_id?.toString() || '', // Convertimos rol_id a string para el select
      password: '', // Añadimos la contraseña como una cadena vacía
    });
    setIsEditing(true);
  };
  

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/usuarios/${id}`);
      alert('Usuario eliminado exitosamente.');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', email: '', rol_id: '', password: '' });
    setIsEditing(false);
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Usuarios</h1>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isEditing && (
  <div>
    <Label htmlFor="password">Contraseña</Label>
    <Input
      id="password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleInputChange}
      required
    />
  </div>
)}

            
            <div>
              <Label htmlFor="rol_id">Rol</Label>
              <select
                id="rol_id"
                name="rol_id"
                value={formData.rol_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="1">Admin</option>
                <option value="2">Reportes</option>
                <option value="3">Bodega</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-2 text-left">Nombre</th>
              <th className="px-6 py-2 text-left">Email</th>
              <th className="px-6 py-2 text-left">Rol</th>
              <th className="px-6 py-2 text-left">Permisos</th>
              <th className="px-6 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">{user.perfil?.name || 'Sin nombre'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.perfil?.roles?.name || 'Sin rol'}</td>
                <td className="px-6 py-4">
                  {user.perfil?.permisos ? user.perfil.permisos.join(', ') : 'Sin permisos'}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Button onClick={() => handleEdit(user)} variant="outline">
                    Editar
                  </Button>
                  <Button onClick={() => handleDelete(user.id)} variant="destructive">
                    Eliminar
                  </Button>
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
