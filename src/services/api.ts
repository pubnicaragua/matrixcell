// Este archivo simula la conexión a un backend
export const fetchInvoices = async () => {
    return [
      { id: 1, number: '#001', amount: '$200', status: 'Pendiente' },
      { id: 2, number: '#002', amount: '$150', status: 'Pagada' },
    ];
  };
  
  export const fetchNotifications = async () => {
    return [
      { id: 1, type: 'Pago', message: 'Factura #001 pendiente de pago.', date: '24/12/2024' },
      { id: 2, type: 'Bloqueo', message: 'Dispositivo bloqueado por falta de pago.', date: '22/12/2024' },
    ];
  };
  
  export const fetchBlockedDevices = async () => {
    return [
      { id: 1, name: 'Dispositivo 1', imei: '123456789' },
      { id: 2, name: 'Dispositivo 2', imei: '987654321' },
    ];
  };
  
  export const fetchUsers = async () => {
    return [
      { id: 1, name: "Juan Perez", email: "juan@example.com", role: "Admin" },
      { id: 2, name: "Ana López", email: "ana@example.com", role: "User" },
    ];
  };
  