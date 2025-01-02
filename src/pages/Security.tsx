// src/pages/Security.tsx
import React, { useState } from "react";

const Security: React.FC = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleToggle2FA = () => {
    setEnable2FA(!enable2FA);
    alert(`Autenticación en dos pasos ${!enable2FA ? "habilitada" : "deshabilitada"}`);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && newPassword) {
      alert("Contraseña actualizada con éxito");
      setPassword("");
      setNewPassword("");
    } else {
      alert("Por favor, llena todos los campos");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Configuración de Seguridad</h2>

      <form onSubmit={handlePasswordUpdate} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <label>Contraseña actual:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          Cambiar contraseña
        </button>
      </form>

      <div style={{ marginTop: "40px" }}>
        <h3>Autenticación en dos pasos (2FA)</h3>
        <p>
          Actualmente: <strong>{enable2FA ? "Habilitada" : "Deshabilitada"}</strong>
        </p>
        <button onClick={handleToggle2FA} style={{ padding: "10px 20px" }}>
          {enable2FA ? "Deshabilitar 2FA" : "Habilitar 2FA"}
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Actividad reciente</h3>
        <ul>
          <li>Inicio de sesión desde IP 192.168.1.15 el 2024-12-20</li>
          <li>Intento fallido desde IP 192.168.1.16 el 2024-12-18</li>
        </ul>
      </div>
    </div>
  );
};

export default Security;
