import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Iconos para acciones
import "../styles/Users.css"; // Archivo CSS para manejar estilos avanzados como hover

const Users = () => {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; role: string }[]>([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin" },
    { id: 2, name: "Ana Gómez", email: "ana@example.com", role: "User" },
  ]);
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; role: string }>({
    id: 0,
    name: "",
    email: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");

  const openModal = (type: "create" | "edit", user?: typeof currentUser) => {
    setModalType(type);
    setCurrentUser(user || { id: 0, name: "", email: "", role: "" }); // id predeterminado en 0
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === "create") {
      const newUser = {
        id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1, // Generar un ID único
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      };
      setUsers([...users, newUser]);
    } else if (modalType === "edit") {
      setUsers(
        users.map((user) => (user.id === currentUser.id ? { ...currentUser, id: user.id } : user))
      );
    }
    setShowModal(false);
    setCurrentUser({ id: 0, name: "", email: "", role: "" }); // Reiniciar el estado
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>Gestión de Usuarios</h1>
      <button
        onClick={() => openModal("create")}
        style={{
          marginBottom: "20px",
          background: "var(--color-primary)",
          color: "var(--color-white)",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Agregar Usuario
      </button>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => openModal("edit", user)}
                  className="action-button edit-button"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="action-button delete-button"
                >
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalType === "create" ? "Agregar Usuario" : "Editar Usuario"}</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rol</label>
                <input
                  type="text"
                  id="role"
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                />
              </div>
              <button type="button" onClick={handleSave} className="save-button">
                Guardar
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
