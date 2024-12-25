import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    apiKey: "1234-5678-ABCD",
  });

  const handleChangeTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleSave = () => {
    alert("Configuraciones guardadas exitosamente.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>Configuraciones</h1>
      <div style={{ marginTop: "20px" }}>
        <div>
          <label>Modo Oscuro:</label>
          <button
            onClick={handleChangeTheme}
            style={{
              marginLeft: "10px",
              background: "var(--color-secondary)",
              color: "var(--color-white)",
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {settings.theme === "light" ? "Activar" : "Desactivar"}
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>API Key:</label>
          <input
            type="text"
            value={settings.apiKey}
            readOnly
            style={{
              marginLeft: "10px",
              padding: "5px",
              border: "1px solid var(--color-secondary)",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            background: "var(--color-primary)",
            color: "var(--color-white)",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Guardar Configuraciones
        </button>
      </div>
    </div>
  );
};

export default Settings;
