import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.phone || 'No registrado'}</p>
          <p><strong>Rol:</strong> {user.role || 'Usuario'}</p>
        </div>
      ) : (
        <p>No hay usuario autenticado</p>
      )}
    </div>
  );
};

export default Profile;
