import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Notification {
  id: number;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("id, mensaje, leido, created_at")
        .eq("leido", false) // Solo las no leídas
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    const { data, error } = await supabase
      .from("notificaciones")
      .update({ leido: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      setNotifications(notifications.filter((notification) => notification.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notificaciones</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                background: "var(--color-light)",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <FaBell style={{ marginRight: "10px", color: "var(--color-primary)" }} />
              <div>
                <strong>{notification.mensaje}</strong>
                <div style={{ fontSize: "0.8rem", color: "#555" }}>
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </div>
              <FaCheckCircle style={{ marginLeft: "10px", color: "green" }} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes notificaciones nuevas.</p>
      )}
    </div>
  );
};

export default Notifications;
