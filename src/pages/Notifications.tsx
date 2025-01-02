import React, { useState } from "react";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: Date;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Factura INV001 está pendiente de pago.",
      read: false,
      timestamp: new Date("2024-12-20T10:00:00"),
    },
    {
      id: 2,
      message: "Dispositivo bloqueado por mora.",
      read: true,
      timestamp: new Date("2024-12-21T14:30:00"),
    },
  ]);

  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.read;
    if (filter === "unread") return !notification.read;
    return true; // "all"
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notificaciones</h1>

      {/* Barra de acciones */}
      <div style={styles.actions}>
        <button onClick={() => setFilter("all")} style={styles.filterButton}>
          Todas
        </button>
        <button onClick={() => setFilter("unread")} style={styles.filterButton}>
          No Leídas
        </button>
        <button onClick={() => setFilter("read")} style={styles.filterButton}>
          Leídas
        </button>
        <button onClick={handleMarkAllAsRead} style={styles.markAllButton}>
          Marcar Todas como Leídas
        </button>
      </div>

      {/* Lista de notificaciones */}
      <ul style={styles.list}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                ...styles.notification,
                backgroundColor: notification.read
                  ? "#e0e0e0"
                  : "#007BFF",
                color: notification.read ? "#333" : "#fff",
              }}
            >
              <div>
                <p style={styles.message}>{notification.message}</p>
                <span style={styles.timestamp}>
                  {notification.timestamp.toLocaleString()}
                </span>
              </div>
              <div style={styles.actions}>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    style={styles.readButton}
                  >
                    Marcar como Leído
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  style={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p style={styles.noNotifications}>No hay notificaciones.</p>
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
    fontSize: "24px",
    color: "#007BFF",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  filterButton: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  markAllButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  notification: {
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "bold" as const,
  },
  timestamp: {
    fontSize: "12px",
    color: "#666",
  },
  readButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noNotifications: {
    textAlign: "center" as const,
    color: "#666",
  },
};

export default Notifications;
