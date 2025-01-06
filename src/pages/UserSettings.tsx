import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const UserSettings = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: 'light',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }
    setSuccessMessage('Los cambios se han guardado exitosamente.');
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}>Configuración de Usuario</h1>
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="preferences" style={styles.label}>Preferencias</label>
            <select
              id="preferences"
              name="preferences"
              value={formData.preferences}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="light">Modo Claro</option>
              <option value="dark">Modo Oscuro</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: 'var(--color-background)',
    minHeight: '100vh',
  },
  title: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
    marginBottom: '20px',
  },
  form: {
    background: 'var(--color-white)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
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
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  successMessage: {
    color: 'green',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default UserSettings;
