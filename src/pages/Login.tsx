import React, { useState } from 'react';
import { getAuthTokens } from '../api/endpoints'  // Asegúrate de importar correctamente tu función

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el login
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();  // Evitar el comportamiento por defecto del formulario

    try {
      // Llamamos a la función para obtener los tokens
      const { access_token, refresh_token, expires_in } = await getAuthTokens(email, password);

      // Almacenar el access_token y refresh_token en el localStorage o en el estado global
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      // Redirigir al usuario a la página principal o alguna otra página
      window.location.href = '/home';  // Ejemplo de redirección (ajustar según tu caso)

    } catch (error) {
      // Manejo de errores (por ejemplo, credenciales incorrectas)
      setError('Error al iniciar sesión. Verifica tu correo y contraseña.');
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
