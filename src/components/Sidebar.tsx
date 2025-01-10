'use client'

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import api from '../axiosConfig';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('auth/logout');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="relative">
      {/* Botón para desplegar el menú */}
      <button
        className="absolute top-4 left-4 z-50 block md:hidden text-gray-800"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Menú lateral */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto bg-green-600 text-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        <div className="p-4 mt-10 md:mt-0">
          <h2 className="text-xl font-bold">MatrixCell Admin</h2>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
            <FaHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link to="/invoices" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span>Facturas</span>
          </Link>

          <Link to="/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
            <FaBell className="h-5 w-5" />
            <span>Notificaciones</span>
          </Link>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">
              Gestión
            </p>
            <Link to="/profile" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaUser className="h-5 w-5" />
              <span>Mi Perfil</span>
            </Link>
            <Link to="/users" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaUsers className="h-5 w-5" />
              <span>Usuarios</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">
              Reportes
            </p>
            <Link to="/reports" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaChartLine className="h-5 w-5" />
              <span>Reportes Financieros</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">
              Consolidado Equifax
            </p>
            <Link to="/exportsicom" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaChartLine className="h-5 w-5" />
              <span>Consolidado Equifax</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">
              Inventario
            </p>
            <Link to="/inventory" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaChartLine className="h-5 w-5" />
              <span>Añadir Inventario</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">
              Configuración
            </p>
            <Link to="/settings" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaCogs className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
            <Link to="/security" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaLock className="h-5 w-5" />
              <span>Seguridad</span>
            </Link>
          </div>
          </nav>

<div className="border-t border-green-700 p-4">
  <button
    onClick={handleLogout}
    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700"
  >
    <FaSignOutAlt className="h-5 w-5" />
    <span>Cerrar Sesión</span>
  </button>
</div>
</div>
</aside>
);
}

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column' as 'column', // Cambiar a columna en pantallas pequeñas
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto' as 'auto',
  },
};
