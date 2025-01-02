import React, { useState } from 'react';
import supabase from '../api/supabase';

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Contraseña actualizada correctamente.');
    }
  };

  return (
    <div>
      <h2>Seguridad de la Cuenta</h2>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>Contraseña Actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Actualizar Contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Security;
