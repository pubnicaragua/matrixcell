import React, { useState, useEffect } from "react";
import supabase from "../api/supabase";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Notification {
  id: number;
  mensaje: string;
  estado_id: number;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  // Obtener las notificaciones desde Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("id, mensaje, estado_id, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }
    };

    fetchNotifications();
  }, []);

  // Marcar una notificación como leída
  const handleMarkAsRead = async (id: number) => {
    const { error } = await supabase
      .from("notificaciones")
      .update({ estado_id: 2 }) // Actualizamos el estado_id a '2' (leído)
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, estado_id: 2 } : notification
        )
      );
    }
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = async () => {
    const { error } = await supabase
      .from("notificaciones")
      .update({ estado_id: 2 }) // Cambiar a estado_id = 2 (leído)
      .in("id", notifications.map((notif) => notif.id));

    if (error) {
      console.error("Error marking all notifications as read:", error);
    } else {
      setNotifications(notifications.map((notification) => ({ ...notification, estado_id: 2 })));
    }
  };

  // Eliminar una notificación
  const handleDeleteNotification = async (id: number) => {
    const { error } = await supabase.from("notificaciones").delete().eq("id", id);

    if (error) {
      console.error("Error deleting notification:", error);
    } else {
      setNotifications(notifications.filter((notification) => notification.id !== id));
    }
  };

  // Filtrar las notificaciones según el estado
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.estado_id === 2;
    if (filter === "unread") return notification.estado_id === 1;
    return true; // "all"
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Notificaciones</h1>

      {/* Barra de acciones */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setFilter("all")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("unread")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          No Leídas
        </button>
        <button
          onClick={() => setFilter("read")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Leídas
        </button>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Marcar Todas como Leídas
        </button>
      </div>

      {/* Lista de notificaciones */}
      <ul className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                notification.estado_id === 2 ? "bg-gray-200" : "bg-blue-500 text-white"
              } hover:bg-gray-300 transition`}
            >
              <FaBell className="mr-4" />
              <div className="flex-1">
                <strong className="block">{notification.mensaje}</strong>
                <span className="text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <div className="ml-4 flex items-center">
                {notification.estado_id === 1 && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 mr-3"
                  >
                    Marcar como Leído
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay notificaciones.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
