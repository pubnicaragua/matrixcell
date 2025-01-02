import supabase from '../api/supabase';
import api from '../api/endpoints';

// Ejemplo de función para obtener datos desde Supabase
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// Ejemplo de función para enviar datos a una API externa
export const sendNotification = async (token: string, message: string) => {
  return await api.post('/notifications', {
    to: token,
    body: message,
    title: 'Nueva Notificación',
  });
};
