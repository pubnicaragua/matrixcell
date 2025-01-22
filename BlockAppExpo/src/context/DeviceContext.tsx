import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import axios from 'axios';

interface DeviceContextProps {
  deviceId: string;
  deviceName: string;
  osName: string;
  ip: string;
  imei: string;
  isBlocked: boolean;
  blockDevice: () => void;
  unblockDevice: (code: string) => boolean;
}

export const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imei] = useState<string>('No soportado en Expo'); // No necesitamos `setImei`
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [osName, setOsName] = useState('');
  const [ip, setIp] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Obtener nombre del dispositivo y SO
        setDeviceName(Device.modelName || 'Unknown Device');
        setOsName(Device.osName || 'Unknown OS');

        // Generar un identificador único para el dispositivo
        let storedDeviceId = await SecureStore.getItemAsync('device_id');
        if (!storedDeviceId) {
          storedDeviceId = `device-${Math.random().toString(36).substring(2, 10)}`;
          await SecureStore.setItemAsync('device_id', storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        // Obtener la dirección IP local
        const ipAddress = await Network.getIpAddressAsync();
        setIp(ipAddress || 'Desconocida');
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la información del dispositivo.');
        console.error(error);
      }
    };

    fetchDeviceInfo();
  }, []);

  // Obtener la IP pública
  useEffect(() => {
    const fetchPublicIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setIp(response.data.ip); // Establece la IP pública
      } catch (error) {
        console.error('Error al obtener la IP pública:', error);
      }
    };

    fetchPublicIP();
  }, []);

  const blockDevice = () => {
    setIsBlocked(true);
  };

  const unblockDevice = (code: string) => {
    if (code === 'Matrixcell2025') {
      setIsBlocked(false);
      return true;
    }
    return false;
  };

  // Bloqueo basado en la fecha
  useEffect(() => {
    const checkDate = () => {
      const today = new Date();
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      if (today.getDate() === lastDayOfMonth) {
        Alert.alert('Bloqueo', 'El dispositivo está bloqueado por fecha de corte.');
        blockDevice();
      }
    };

    const interval = setInterval(checkDate, 86400000); // Verificar diariamente
    return () => clearInterval(interval); // Limpiar intervalos
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        deviceId,
        deviceName,
        osName,
        ip,
        imei,
        isBlocked,
        blockDevice,
        unblockDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
