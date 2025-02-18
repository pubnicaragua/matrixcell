import React, { useState, useEffect } from 'react';
import axiosConfig from '../axiosConfig';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';


//comentario
interface Perfil {
  id: string;
  name: string;
  email: string;
  rol: string;
  store: string;
  permisos: string[];
}

const Profile = () => {
  const [perfilData, setPerfilData] = useState<Perfil | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const perfil = localStorage.getItem('perfil');
    const usuario = localStorage.getItem('usuario');
    const permisos = localStorage.getItem('permisos');

    if (perfil && usuario && permisos) {
      try {
        const parsedPerfil = JSON.parse(perfil);
        const parsedUsuario = JSON.parse(usuario);
        const parsedPermisos = JSON.parse(permisos);

        const userId = parsedUsuario?.id || ''; // Obtener el ID del usuario

        setPerfilData({
          id: userId,
          name: parsedPerfil?.name || 'Usuario desconocido',
          email: parsedUsuario?.email || 'Sin email',
          rol: parsedPerfil?.roles?.name || 'Sin rol',
          store: parsedPerfil?.store?.name || 'Sin tienda',
          permisos: Array.isArray(parsedPermisos) ? parsedPermisos : [],
        });

        setFormData({
          name: parsedPerfil?.name || '',
          email: parsedUsuario?.email || '',
        });
      } catch (error) {
        console.error('Error al analizar datos del perfil:', error);
      }
    } else {
      console.warn('Datos del perfil incompletos en localStorage.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (perfilData) {
        const payload = {
          name: formData.name,
          email: formData.email,
        };

        console.log('Payload enviado:', payload);

        // Enviar solicitud PUT
        await axiosConfig.put(`/usuarios/${perfilData.id}`, payload);

        // Actualizar el estado del perfil
        setPerfilData((prev) => ({ ...prev, name: formData.name, email: formData.email } as Perfil));

        // Actualizar localStorage
        const updatedPerfil = { ...perfilData, name: formData.name };
        const updatedUsuario = { ...JSON.parse(localStorage.getItem('usuario') || '{}'), email: formData.email };
        localStorage.setItem('perfil', JSON.stringify(updatedPerfil));
        localStorage.setItem('usuario', JSON.stringify(updatedUsuario));

        setIsEditing(false);
        alert('Perfil actualizado con éxito.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Mi Perfil</h1>

      {perfilData ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditing ? 'Editar Perfil' : `Perfil de ${perfilData.name}`}
            </h2>
          </CardHeader>

          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
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
                  <span className="font-medium text-gray-700">Tienda:</span>
                  <span className="text-gray-600">{perfilData.store}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Permisos:</span>
                  <span className="text-gray-600">{perfilData.permisos.join(', ')}</span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Guardar Cambios</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center text-gray-600">
          <p>Cargando información del perfil...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
