import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Usamos `useNavigate` para redirigir
import api from '../axiosConfig';
import {
  FaHome,
  FaFileInvoiceDollar,
  FaBell,
  FaUser,
  FaUsers,
  FaChartLine,
  FaCogs,
  FaLock,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();  // Usamos el hook `useNavigate` para redirigir

  const handleLogout = async () => {
    try {
      // Llamada a la ruta /logout en el backend para invalidar la sesión
      await api.post('auth/logout');  // Aquí se hace la solicitud para cerrar la sesión en el backend

      // Elimina el token del localStorage
      localStorage.removeItem('token');
      
      // Redirige al login
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <nav style={styles.sidebar}>
      <h2 style={styles.title}>MatrixCell Admin</h2>
      <ul style={styles.list}>
        {/* Inicio */}
        <li style={styles.listItem}>
          <FaHome style={styles.icon} />
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
        </li>

        {/* Gestión de Facturas */}
        <li style={styles.listItem}>
          <FaFileInvoiceDollar style={styles.icon} />
          <Link to="/invoices" style={styles.link}>
            Facturas
          </Link>
        </li>

        {/* Notificaciones */}
        <li style={styles.listItem}>
          <FaBell style={styles.icon} />
          <Link to="/notifications" style={styles.link}>
            Notificaciones
          </Link>
        </li>

        {/* Gestión */}
        <li style={styles.sectionTitle}>Gestión</li>
        <li style={styles.listItem}>
          <FaUser style={styles.icon} />
          <Link to="/profile" style={styles.link}>
            Mi Perfil
          </Link>
        </li>
        <li style={styles.listItem}>
          <FaUsers style={styles.icon} />
          <Link to="/users" style={styles.link}>
            Usuarios
          </Link>
        </li>

        {/* Reportes */}
        <li style={styles.sectionTitle}>Reportes</li>
        <li style={styles.listItem}>
          <FaChartLine style={styles.icon} />
          <Link to="/reports" style={styles.link}>
            Reportes Financieros
          </Link>
        </li>

        {/* Equifax */}
        <li style={styles.sectionTitle}>Consolidado Equifax</li>
        <li style={styles.listItem}>
          <FaChartLine style={styles.icon} />
          <Link to="/exportsicom" style={styles.link}>
            Consolidado Equifax
          </Link>
        </li>

        {/* Inventario */}
        <li style={styles.sectionTitle}>Agregar Inventario</li>
        <li style={styles.listItem}>
          <FaChartLine style={styles.icon} />
          <Link to="/inventory" style={styles.link}>
            Agregar Inventario
          </Link>
        </li>

        {/* Configuración */}
        <li style={styles.sectionTitle}>Configuración</li>
        <li style={styles.listItem}>
          <FaCogs style={styles.icon} />
          <Link to="/settings" style={styles.link}>
            Configuración
          </Link>
        </li>
        <li style={styles.listItem}>
          <FaLock style={styles.icon} />
          <Link to="/security" style={styles.link}>
            Seguridad
          </Link>
        </li>

        {/* Salir */}
        <li style={styles.sectionTitle}>Cuenta</li>
        <li style={styles.listItem}>
          <FaSignOutAlt style={styles.icon} />
          <button onClick={handleLogout} style={styles.link}>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    background: 'var(--color-primary)',
    height: '100vh',
    color: 'var(--color-white)',
    padding: '20px',
  } as React.CSSProperties,
  title: {
    fontFamily: 'var(--font-primary)',
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  } as React.CSSProperties,
  listItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  link: {
    color: 'var(--color-white)',
    textDecoration: 'none',
    fontSize: '16px',
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  icon: {
    fontSize: '18px',
  } as React.CSSProperties,
  sectionTitle: {
    marginTop: '20px',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.7)',
  } as React.CSSProperties,
};

export default Sidebar;
