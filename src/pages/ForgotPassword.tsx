import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Alert } from '../components/ui/alert-message';
import axios from '../axiosConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Por favor, ingresa un correo válido.');
      setMessage('');
      return;
    }

    try {
      const response = await axios.post('auth/reset-password', { email });
      setMessage(response.data.message); // Mensaje del backend
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">Olvidaste tu contraseña</h2>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={handleInputChange}
            />
          </div>

          {message && (
            <Alert type="success" title="Éxito" description={message} />
          )}

          {error && (
            <Alert type="error" title="Error" description={error} />
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>Enviar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
