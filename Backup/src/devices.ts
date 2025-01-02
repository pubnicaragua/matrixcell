import apiClient from './apiClient';

export const fetchDevices = async () => {
  const response = await apiClient.get('/devices');
  return response.data;
};

export const lockDevice = async (deviceId: string) => {
  const response = await apiClient.post(`/devices/${deviceId}/lock`);
  return response.data;
};

export const unlockDevice = async (deviceId: string) => {
  const response = await apiClient.post(`/devices/${deviceId}/unlock`);
  return response.data;
};
