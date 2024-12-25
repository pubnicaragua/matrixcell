import React, { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<
    { id: number; message: string; read: boolean }[]
  >([
    { id: 1, message: "Factura INV001 está pendiente de pago.", read: false },
    { id: 2, message: "Dispositivo bloqueado por mora.", read: true },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Notificaciones
      </h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            style={{
              padding: "10px",
              margin: "10px 0",
              background: notification.read
                ? "var(--color-background)"
                : "var(--color-secondary)",
              color: "var(--color-white)",
              borderRadius: "4px",
            }}
          >
            {notification.message}
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                style={{
                  marginLeft: "10px",
                  background: "var(--color-primary)",
                  color: "var(--color-white)",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Marcar como leído
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
