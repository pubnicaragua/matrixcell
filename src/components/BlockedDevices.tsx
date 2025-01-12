interface Device {
  id: number;
  imei: string;
  status: string;
}

interface BlockedDevicesProps {
  devices: Device[];
}

const BlockedDevices: React.FC<BlockedDevicesProps> = ({ devices }) => {
  const blockedDevices = devices.filter(device => device.status === 'Bloqueado');

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Dispositivos Bloqueados</h3>
      {blockedDevices.length > 0 ? (
        <ul className="list-disc pl-6">
          {blockedDevices.map(device => (
            <li key={device.id}>IMEI: {device.imei}</li>
          ))}
        </ul>
      ) : (
        <p>No hay dispositivos bloqueados.</p>
      )}
    </div>
  );
};

export default BlockedDevices;

