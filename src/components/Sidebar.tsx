"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LoginModal } from "./LoginModal"
import { useAuth } from "../context/AuthContext"
import {
  FaHome,
  FaFileInvoiceDollar,
  FaBell,
  FaUser,
  FaUsers,
  FaChartLine,
  FaCogs,
  FaUsersCog,
  FaTools,
  FaLock,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMobileAlt,
  FaBook, // Añadido import para el icono de Manual de Usuario
} from "react-icons/fa"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [targetRoute, setTargetRoute] = useState("")
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
    window.location.reload()
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLinkClick = (route: string) => {
    setTargetRoute(route)
    setIsLoginModalOpen(true)
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    // La navegación y recarga ahora se manejan en el LoginModal
  }

  return (
    <aside className="h-screen relative">
      {/* Botón para desplegar el menú */}
      <button className="absolute top-4 left-4 z-50 block md:hidden text-gray-800" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Menú lateral */}
      <div
        className={`fixed inset-y-0 left-0 z-40 h-full w-64 flex-shrink-0 flex flex-col overflow-auto bg-green-600 text-white transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative`}
      >
        <div className="p-4 mt-10 md:mt-0">
          <h2 className="text-xl font-bold">MatrixCell Admin</h2>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
            <FaHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <button
            onClick={() => handleLinkClick("/invoices")}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
          >
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span>Facturas</span>
          </button>

          <button
            onClick={() => handleLinkClick("/notifications")}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
          >
            <FaBell className="h-5 w-5" />
            <span>Notificaciones</span>
          </button>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Gestión</p>

            <button
              onClick={() => handleLinkClick("/users")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaUsers className="h-5 w-5" />
              <span>Usuarios</span>
            </button>

            <button
              onClick={() => handleLinkClick("/stores")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaLock className="h-5 w-5" />
              <span>Tiendas</span>
            </button>

            <button
              onClick={() => handleLinkClick("/addclient")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaUsersCog className="h-5 w-5" />
              <span>Clientes</span>
            </button>

            <button
              onClick={() => handleLinkClick("/technicalservices")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaTools className="h-5 w-5" />
              <span>Servicios Técnicos</span>
            </button>

            <button
              onClick={() => handleLinkClick("/blockdevice")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaMobileAlt className="h-5 w-5" />
              <span>Gestionar Dispositivos</span>
            </button>

            <button
              onClick={() => handleLinkClick("/quote-page")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaFileInvoiceDollar className="h-5 w-5" />
              <span>Financiamiento</span>
            </button>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Reportes</p>

            <button
              onClick={() => handleLinkClick("/reports")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaChartLine className="h-5 w-5" />
              <span>Reportes Financieros</span>
            </button>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Consolidado Equifax</p>

            <button
              onClick={() => handleLinkClick("/exportsicom")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaChartLine className="h-5 w-5" />
              <span>Consolidado Equifax</span>
            </button>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Inventario</p>

            <button
              onClick={() => handleLinkClick("/inventory")}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700 w-full text-left"
            >
              <FaChartLine className="h-5 w-5" />
              <span>Añadir Inventario</span>
            </button>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Configuración</p>
            <Link to="/settings" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaCogs className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
            <Link to="/profile" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaUser className="h-5 w-5" />
              <span>Mi Perfil</span>
            </Link>
            <Link to="/security" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaLock className="h-5 w-5" />
              <span>Seguridad</span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-green-200">Manual de Usuario</p>
            <Link to="/capacitacion" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-700">
              <FaBook className="h-5 w-5" />
              <span>Como usar los modulos</span>
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

      {/* Modal de verificación de contraseña */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        targetRoute={targetRoute} // Asegúrate de pasar la prop
      />

    </aside>
  )
}

