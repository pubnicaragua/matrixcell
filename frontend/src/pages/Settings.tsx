import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    apiKey: "1234-5678-ABCD",
  });

  const handleThemeToggle = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleNotificationsToggle = () => {
    setSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const handleSave = () => {
    alert("Configuraciones guardadas exitosamente.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Configuración
      </h1>
      <p style={{ marginTop: "10px", fontFamily: "var(--font-secondary)", color: "#555" }}>
        Ajusta la configuración de tu cuenta y preferencias del sistema.
      </p>

      <div style={{ marginTop: "20px" }}>
        {/* Modo Oscuro */}
        <div style={{ marginBottom: "20px" }}>
          <label>Modo Oscuro:</label>
          <button
            onClick={handleThemeToggle}
            style={styles.button}
          >
            {settings.theme === "light" ? "Activar" : "Desactivar"}
          </button>
        </div>

        {/* Notificaciones */}
        <div style={{ marginBottom: "20px" }}>
          <label>Notificaciones:</label>
          <button
            onClick={handleNotificationsToggle}
            style={styles.button}
          >
            {settings.notifications ? "Desactivar" : "Activar"}
          </button>
        </div>

        {/* API Key */}
        <div>
          <label>Clave API:</label>
          <input
            type="text"
            value={settings.apiKey}
            readOnly
            style={styles.input}
          />
        </div>

        {/* Guardar Cambios */}
        <button
          onClick={handleSave}
          style={{ ...styles.button, marginTop: "20px" }}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

const styles = {
  button: {
    marginLeft: "10px",
    background: "var(--color-secondary)",
    color: "var(--color-white)",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    marginLeft: "10px",
    padding: "8px",
    border: "1px solid var(--color-secondary)",
    borderRadius: "4px",
    width: "300px",
  },
};

export default Settings;
