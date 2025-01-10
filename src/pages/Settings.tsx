import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-2">Configuración</h1>
      <p className="text-muted-foreground mb-6">
        Ajusta la configuración de tu cuenta y preferencias del sistema.
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-toggle" className="text-lg">Modo Oscuro</Label>
          <Switch
            id="theme-toggle"
            checked={settings.theme === "dark"}
            onCheckedChange={handleThemeToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-toggle" className="text-lg">Notificaciones</Label>
          <Switch
            id="notifications-toggle"
            checked={settings.notifications}
            onCheckedChange={handleNotificationsToggle}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-lg">Clave API</Label>
          <Input
            id="api-key"
            type="text"
            value={settings.apiKey}
            readOnly
            className="w-full"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default Settings;

