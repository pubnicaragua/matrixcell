"use client"

import { useState, useEffect } from "react"
import api from "../axiosConfig"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

interface Notification {
  id: string
  message: string
  created_at: string
  status: "Leída" | "No Leída"
  store_id: number
}

const NotificationsView = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "Leída" | "No Leída">("all")
  const { userRole, userStore } = useAuth()
  const [storeName, setStoreName] = useState<string>("")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications")
        // Filtrar notificaciones por tienda si el usuario no es admin
        const filteredNotifications =
          userRole === 1
            ? response.data
            : response.data.filter((notification: Notification) => notification.store_id === userStore)
        setNotifications(filteredNotifications)
      } catch (err: any) {
        setError(err.message || "Error al obtener las notificaciones")
      } finally {
        setLoading(false)
      }
    }

    const getStoreName = () => {
      const perfil = localStorage.getItem("perfil")
      if (perfil) {
        const parsedPerfil = JSON.parse(perfil)
        setStoreName(parsedPerfil.store?.name || "")
      }
    }

    fetchNotifications()
    getStoreName()
  }, [userRole, userStore])

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/notifications/${id}`, { status: "Leída" })
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id ? { ...notification, status: "Leída" } : notification,
          ),
        )
      }
    } catch (err: any) {
      setError(err.message || "Error al actualizar el estado de la notificación")
    }
  }

  // Filtrar las notificaciones basadas en el estado
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Leída") return notification.status === "Leída"
    if (filter === "No Leída") return notification.status === "No Leída"
    return true // Devuelve todas las notificaciones si el filtro es "all"
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Notificaciones</h1>
        {!loading && storeName && <h2 className="text-xl text-gray-600 mt-2">Tienda: {storeName}</h2>}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Filtros para mostrar las notificaciones leída/no leída */}
      <div className="mb-4 flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600`}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filter === "No Leída" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600`}
          onClick={() => setFilter("No Leída")}
        >
          No Leída
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filter === "Leída" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600`}
          onClick={() => setFilter("Leída")}
        >
          Leída
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {filteredNotifications.map((notification) => (
              <li key={notification.id} className="flex justify-between items-center border-b p-4 hover:bg-gray-100">
                <div>
                  <p className="text-gray-800 font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
                <div>
                  {notification.status === "No Leída" && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Marcar como Leída
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationsView

