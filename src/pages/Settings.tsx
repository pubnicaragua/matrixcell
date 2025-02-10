"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    apiKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY",
  });

  const [showApiKey, setShowApiKey] = useState(false); // Estado para mostrar/ocultar la clave API

  const handleNotificationsToggle = () => {
    setSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    alert("Clave API copiada al portapapeles.");
  };

  const handleSave = () => {
    alert("Configuraciones guardadas exitosamente.");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-2">Configuración</h1>
      <p className="text-muted-foreground mb-6">Ajusta la configuración de tu cuenta y preferencias del sistema.</p>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-toggle" className="text-lg flex items-center gap-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Modo Oscuro
          </Label>
          <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-toggle" className="text-lg">
            Notificaciones
          </Label>
          <Switch
            id="notifications-toggle"
            checked={settings.notifications}
            onCheckedChange={handleNotificationsToggle}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-lg">
            Clave API
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="api-key"
              type="text"
              value={showApiKey ? settings.apiKey : "****************"}
              readOnly
              className="w-full bg-muted"
            />
            <Button onClick={() => setShowApiKey(!showApiKey)} variant="outline">
              {showApiKey ? "Ocultar" : "Mostrar"}
            </Button>
            <Button onClick={handleCopyApiKey} variant="outline">
              Copiar
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default Settings;
