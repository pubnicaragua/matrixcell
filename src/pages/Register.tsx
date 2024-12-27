import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase'; // Asegúrate de importar correctamente el cliente de Supabase

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      setLoading(false);
      return;
    }

    // Usando Supabase para registrar el usuario
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Si el registro fue exitoso, mostrar el mensaje de éxito y redirigir a la página principal
        setSuccessMessage('Se ha enviado un enlace a tu correo para confirmar tu cuenta.');
        setTimeout(() => {
          navigate('/'); // Redirigir a la página principal después de 3 segundos
        }, 3000);
      }
    } catch (err) {
      setError('Hubo un error al registrar el usuario. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registro - MatrixCell Admin</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <div style={styles.extra}>
            <p style={styles.text}>¿Ya tienes cuenta? <a href="/login" style={styles.link}>Inicia sesión aquí</a></p>
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
    padding: '10px',
  } as React.CSSProperties,
  card: {
    padding: '20px',
    borderRadius: '8px',
    background: 'var(--color-white)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box' as 'border-box',
  } as React.CSSProperties,
  title: {
    textAlign: 'center' as 'center',
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
    boxSizing: 'border-box' as 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background 0.3s ease',
  },
  buttonDisabled: {
    cursor: 'not-allowed',
    background: 'var(--color-gray)',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
    fontSize: '14px',
  },
  extra: {
    marginTop: '10px',
    textAlign: 'center' as 'center',
  },
  link: {
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  text: {
    fontSize: '14px',
  },
};

export default Register;
