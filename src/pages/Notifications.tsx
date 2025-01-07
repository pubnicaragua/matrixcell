import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../axiosConfig';

// Define la interfaz de notificación
interface Notification {
  id: string;
  message: string;
  created_at: string;
  status: 'Leída' | 'No Leída'; // Definimos los estados en español
}

const NotificationsView = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Tipar el estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Leída' | 'No Leída'>('all'); // Filtro para todos, leída y no leída

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');  // Obtener el token de localStorage
      try {
        const response = await api.get('/notifications', {
          headers: {
            Authorization: `Bearer ${token}`  // Agregar token en los headers
          }
        });
        setNotifications(response.data); 
      } catch (err: any) {
        setError(err.message || 'Error al obtener las notificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
}, []);


  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/notifications/${id}`, { status: 'Leída' });
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id ? { ...notification, status: 'Leída' } : notification
          )
        );
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado de la notificación');
    }
  };

  // Filtrar las notificaciones basadas en el estado
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'Leída') return notification.status === 'Leída';
    if (filter === 'No Leída') return notification.status === 'No Leída';
    return true; // Devuelve todas las notificaciones si el filtro es "all"
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Notificaciones</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Filtros para mostrar las notificaciones leída/no leída */}
      <div className="mb-4 flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-600`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filter === 'No Leída' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-600`}
          onClick={() => setFilter('No Leída')}
        >
          No Leída
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filter === 'Leída' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-600`}
          onClick={() => setFilter('Leída')}
        >
          Leída
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className="flex justify-between items-center border-b p-4 hover:bg-gray-100"
              >
                <div>
                  <p className="text-gray-800 font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  {notification.status === 'No Leída' && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Marcar como Leída
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
