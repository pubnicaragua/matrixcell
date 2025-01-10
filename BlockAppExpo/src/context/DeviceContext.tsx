import React, { createContext, useState, useEffect, ReactNode } from 'react';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';

interface DeviceContextProps {
  imei: string;
  ip: string;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [imei, setImei] = useState<string>(''); // Garantiza que el estado sea siempre string
  const [ip, setIp] = useState<string>(''); // Garantiza que el estado sea siempre string

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const fetchedImei = await DeviceInfo.getUniqueId();
        const fetchedIp = await NetworkInfo.getIPAddress();

        setImei(fetchedImei || 'Desconocido'); // Maneja null
        setIp(fetchedIp || 'Desconocido'); // Maneja null
      } catch (error) {
        console.error('Error al obtener información del dispositivo:', error);
      }
    };

    fetchDeviceInfo();
  }, []);

  return (
    <DeviceContext.Provider value={{ imei, ip }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
