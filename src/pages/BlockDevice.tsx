import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';  // Importa la configuración de axios

interface Device {
  id: number;
  imei: string;
  status: string;
  owner: string;
  store_id: number;
  unlock_code: string;
}

interface Store {
  id: number;
  name: string;
}

const DevicesView: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);  // Estado para el archivo

  const fetchDevices = async () => {
    try {
      const response = await api.get('/devices');
      setDevices(response.data);
    } catch (err: any) {
      setError(err.message || 'Error fetching devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err: any) {
      alert("Error al cargar los clientes: " + err.message);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Error al obtener las tiendas: ' + err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };
  useEffect(() => {

    fetchDevices();
    fetchClients();
    fetchStores();
  }, []);

  // Función para obtener el nombre del cliente basado en el owner (llave foránea)
  const getClientName = (ownerId: string) => {
    const client = clients.find(client => client.id === ownerId);
    return client ? client.name : 'Cliente no encontrado';
  };

  // Función para obtener el nombre de la tienda basado en el store_id
  const getStoreName = (storeId: number) => {
    const store = stores.find(store => store.id === storeId);
    return store ? store.name : 'Tienda no encontrada';
  };

  const toggleDeviceStatus = async (device: Device) => {
    const newStatus = device.status === 'Bloqueado' ? 'Desbloqueado' : 'Bloqueado';
    try {
      await api.put(`/devices/${device.id}`, { status: newStatus });
      setDevices((prevDevices) =>
        prevDevices.map((d) =>
          d.id === device.id ? { ...d, status: newStatus } : d
        )
      );
    } catch (err: any) {
      console.error('Error updating device status:', err.message || err);
    }
  };

  const blockedCount = devices.filter(device => device.status === 'Bloqueado').length;
  const unblockedCount = devices.filter(device => device.status === 'Desbloqueado').length;
  const totalCount = devices.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post('/devices/insert-masive', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Archivo subido con éxito');
      fetchDevices();
      console.log('Respuesta del servidor:', response.data);
    } catch (err: any) {
      alert('Error al subir el archivo: ' + err.message);
      console.error('Error al subir el archivo:', err);
    }
  };



  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Devices List</h1>

      {/* Campo para seleccionar archivo */}
      <div className="mb-4 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2 border border-gray-300 p-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
        Subir registros masivos
        </button>
      </div>

    

      <div className="mb-4">
        <p className="text-lg font-semibold">Dispositivos:</p>
        <ul className="list-disc pl-6">
          <li>Bloqueados: {blockedCount}</li>
          <li>Desbloqueados: {unblockedCount}</li>
          <li>Todos: {totalCount}</li>
        </ul>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">IMEI</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Cliente</th>
            <th className="border border-gray-300 px-4 py-2">Codigo de Desbloqueo</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={device.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.imei}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{getClientName(device.owner)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.unlock_code}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => toggleDeviceStatus(device)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {device.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DevicesView;
