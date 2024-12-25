import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers(); // Función simulada en `services/api.ts`
      setUsers(data);
      setLoading(false);
    };

    getUsers();
  }, []);

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id)); // Actualiza el estado local
    alert("Usuario eliminado exitosamente.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>Gestión de Usuarios</h1>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "var(--color-secondary)", color: "var(--color-white)" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Rol</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--color-background)" }}>
                <td style={{ padding: "10px" }}>{user.name}</td>
                <td style={{ padding: "10px" }}>{user.email}</td>
                <td style={{ padding: "10px" }}>{user.role}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      background: "var(--color-danger)",
                      color: "var(--color-white)",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
