import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

const CreateNewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      // Simulación de una solicitud para cambiar la contraseña
      // Reemplazar esta sección con tu lógica de solicitud de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage('Tu contraseña se ha actualizado con éxito.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-800">Crear Nueva Contraseña</h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && (
              <Alert type="success" title="Éxito" description={message} />
            )}
            {error && (
              <Alert type="error" title="Error" description={error} />
            )}
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Actualizar Contraseña</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateNewPassword;
