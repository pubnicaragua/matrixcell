import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

interface Device {
  id: number;
  marca: string;
  modelo: string;
  price: number;
}

interface FormularioDispositivoProps {
  onDeviceSelect: (device: { id: number; price: number }) => void;
}

const DeviceSelector: React.FC<FormularioDispositivoProps> = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [newDevice, setNewDevice] = useState({ marca: "", modelo: "", price: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get("/devices");
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleSelectDevice = (id: number) => {
    const device = devices.find((d) => d.id === id);
    if (device) {
      onDeviceSelect({ id: device.id, price: device.price });
      setSelectedDeviceId(id);
    }
  };

  const handleNewDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice({ ...newDevice, [name]: value });
  };

  const handleAddDevice = async () => {
    const { marca, modelo, price } = newDevice;
    if (!marca || !modelo || !price) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await axios.post("/devices", {
        marca,
        modelo,
        price: parseFloat(price),
      });

      setDevices([...devices, response.data]);
      setNewDevice({ marca: "", modelo: "", price: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding new device:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Selecciona un Dispositivo</h1>
      <select
        className="border p-2 rounded w-full"
        onChange={(e) => handleSelectDevice(Number(e.target.value))}
        value={selectedDeviceId || ""}
      >
        <option value="">Seleccione un dispositivo</option>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.marca} - {device.modelo} (${device.price})
          </option>
        ))}
      </select>

      {/* Formulario para agregar un nuevo dispositivo */}
      {!selectedDeviceId && (
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            {showAddForm ? "Cancelar" : "Agregar Nuevo"}
          </button>

          {showAddForm && (
            <div className="p-4 border rounded">
              <h2 className="font-bold mb-2">Agregar Nuevo Dispositivo</h2>
              <div className="mb-2">
                <input
                  type="text"
                  name="marca"
                  placeholder="Marca"
                  className="border p-2 rounded w-full mb-2"
                  value={newDevice.marca}
                  onChange={handleNewDeviceChange}
                />
                <input
                  type="text"
                  name="modelo"
                  placeholder="Modelo"
                  className="border p-2 rounded w-full mb-2"
                  value={newDevice.modelo}
                  onChange={handleNewDeviceChange}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  className="border p-2 rounded w-full mb-2"
                  value={newDevice.price}
                  onChange={handleNewDeviceChange}
                />
              </div>
              <button
                onClick={handleAddDevice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Agregar Dispositivo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;
