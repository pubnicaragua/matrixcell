import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Device {
  id: number;
  imei: string;
  status: string;
  owner: string;
  store_id: number;
}

const DevicesView: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/devices');
        setDevices(response.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const toggleDeviceStatus = async (device: Device) => {
    const newStatus = device.status === 'Bloqueado' ? 'Desbloqueado' : 'Bloqueado';
    try {
      await axios.put(`http://localhost:5000/devices/${device.id}`, { status: newStatus });
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

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Devices List</h1>
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
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Owner</th>
            <th className="border border-gray-300 px-4 py-2">Store ID</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={device.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.imei}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.owner}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{device.store_id}</td>
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
