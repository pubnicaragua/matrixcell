import React, { useState } from 'react';
import api from '../axiosConfig';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('auth/login', {
        email,
        password,
      });

      // Almacenar el token en localStorage o context
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('perfil', JSON.stringify(response.data.usuario));
      localStorage.setItem('usuario', JSON.stringify(response.data.user));
      localStorage.setItem('permisos', JSON.stringify(response.data.permissions));
      console.log(response.data);
      alert('Inicio de sesión exitoso!');

      // Redirigir o cambiar de vista
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
