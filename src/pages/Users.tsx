import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Users.css";
import { supabase } from "../api/supabase";

const Users = () => {
  const [users, setUsers] = useState<{ id: number; nombre: string; email: string; rol: number }[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: number; nombre: string; email: string; rol: number }>({
    id: 0,
    nombre: "",
    email: "",
    rol: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");

  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);

  // Cargar usuarios desde Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol');

    if (error) {
      console.error('Error loading users:', error);
    } else {
      setUsers(data || []);
    }
  };

  // Cargar roles desde Supabase
  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles') // Suponiendo que tienes una tabla 'roles'
      .select('id, nombre');

    if (error) {
      console.error('Error loading roles:', error);
    } else {
      setRoles(data || []);
    }
  };

  useEffect(() => {
    fetchUsers(); // Cargar los usuarios al montar el componente
    fetchRoles(); // Cargar los roles al montar el componente
  }, []);

  const openModal = (type: "create" | "edit", user?: typeof currentUser) => {
    setModalType(type);
    setCurrentUser(user || { id: 0, nombre: "", email: "", rol: 0 });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (modalType === "create") {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            nombre: currentUser.nombre,
            email: currentUser.email,
            rol: currentUser.rol, // Aquí ahora guardamos el ID del rol
          },
        ])
        .select(); // Asegúrate de que devuelva los datos insertados

      if (error) {
        console.error('Error creating user:', error);
      } else {
        if (data && data.length > 0) {
          setUsers([...users, { ...data[0] }]);
        } else {
          console.error('No data returned from the insert operation');
        }
      }
    } else if (modalType === "edit") {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          nombre: currentUser.nombre,
          email: currentUser.email,
          rol: currentUser.rol, // Guardamos el ID del rol
        })
        .eq('id', currentUser.id)
        .select();

      if (error) {
        console.error('Error updating user:', error);
      } else {
        setUsers(
          users.map((user) =>
            user.id === currentUser.id ? { ...currentUser, id: user.id } : user
          )
        );
      }
    }

    setShowModal(false);
    setCurrentUser({ id: 0, nombre: "", email: "", rol: 0 });
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Función para obtener el nombre del rol a partir del id
  const getRoleNameById = (roleId: number) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.nombre : "Desconocido";
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
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{getRoleNameById(user.rol)}</td> {/* Mostrar nombre del rol */}
              <td>
                <button onClick={() => openModal("edit", user)} className="action-button edit-button">
                  <FaEdit /> Editar
                </button>
                <button onClick={() => handleDelete(user.id)} className="action-button delete-button">
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
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  value={currentUser.nombre}
                  onChange={(e) => setCurrentUser({ ...currentUser, nombre: e.target.value })}
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
                <label htmlFor="rol">Rol</label>
                <select
                  id="rol"
                  value={currentUser.rol} // Aquí guardaremos el id del rol seleccionado
                  onChange={(e) => setCurrentUser({ ...currentUser, rol: parseInt(e.target.value) })}
                >
                  <option value="">Seleccionar rol</option> {/* Opción por defecto */}
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nombre} {/* Mostrar el nombre del rol */}
                    </option>
                  ))}
                </select>
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
