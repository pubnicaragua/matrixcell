import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simulated backend user credentials
  const validCredentials = {  
    username: 'admin',
    password: 'admin123',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate an API call delay
    setTimeout(() => {
      if (username === validCredentials.username && password === validCredentials.password) {
        navigate('/'); // Redirect to Dashboard
      } else {
        setError('Usuario o contraseña incorrectos. Intenta nuevamente.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>MatrixCell Admin</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              aria-label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          <div style={styles.extra}>
            <a href="/forgot-password" style={styles.link}>Olvidé mi contraseña</a>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'var(--color-background)',
  } as React.CSSProperties,
  card: {
    padding: '20px',
    borderRadius: '8px',
    background: 'var(--color-white)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  } as React.CSSProperties,
  title: {
    textAlign: 'center' as 'center', // Especificar el valor directamente
    marginBottom: '20px',
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontWeight: 'bold',
    cursor: 'wait',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  extra: {
    marginTop: '10px',
    textAlign: 'center' as 'center', // Especificar el valor directamente
  },
  link: {
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
};


export default Login;
