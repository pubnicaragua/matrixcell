import React from 'react';
import Sidebar from '../components/Sidebar';

const UserSettings = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Configuración de Usuario</h1>
        <form style={{ marginTop: '20px', background: 'var(--color-white)', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
