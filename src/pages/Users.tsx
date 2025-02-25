"use client"

import type React from "react"
import { useState, useEffect } from "react"
import api from "../axiosConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface User {
  id: string
  name: string
  user?: {
    email: string
  }
  perfil?: {
    name: string
    roles: {
      name: string
    }
    rol_id: number
    store_id: number
    store: {
      name: string
    }
    permisos: string[]
  }
}

interface Store {
  id: number
  name: string
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    rol_id: "",
    store_id: "",
    password: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState<number>(0)

  useEffect(() => {
    fetchUsers()
    fetchStores()
    getUserRole()
  }, [])

  const getUserRole = () => {
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get("/usuarios")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchStores = async () => {
    try {
      const response = await api.get("/stores")
      setStores(response.data)
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRole !== 1) {
      alert("No tienes permisos para realizar esta acción.")
      return
    }
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        rol_id: Number.parseInt(formData.rol_id),
        store_id: Number.parseInt(formData.store_id),
        ...(isEditing ? {} : { password: formData.password }),
      }

      if (isEditing) {
        await api.put(`/usuarios/${formData.id}`, payload)
        alert("Usuario actualizado exitosamente.")
      } else {
        await api.post("/usuarios", payload)
        alert("Usuario creado exitosamente.")
      }
      fetchUsers()
      resetForm()
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleEdit = (user: User) => {
    if (userRole !== 1) {
      alert("No tienes permisos para editar usuarios.")
      return
    }
    setFormData({
      id: user.id,
      name: user.perfil?.name || "",
      email: user.user?.email || "",
      rol_id: user.perfil?.rol_id?.toString() || "",
      store_id: user.perfil?.store_id?.toString() || "",
      password: "",
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (userRole !== 1) {
      alert("No tienes permisos para eliminar usuarios.")
      return
    }
    try {
      await api.delete(`/usuarios/${id}`)
      alert("Usuario eliminado exitosamente.")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", rol_id: "", store_id: "", password: "" })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Usuarios</h1>

      {userRole === 1 && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? "Editar Usuario" : "Crear Usuario"}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isEditing && (
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="rol_id">Rol</Label>
                <Select
                  name="rol_id"
                  value={formData.rol_id}
                  onValueChange={(value) => handleInputChange({ target: { name: "rol_id", value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">Reportes</SelectItem>
                    <SelectItem value="3">Bodega</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="store_id">Tienda</Label>
                <Select
                  name="store_id"
                  value={formData.store_id}
                  onValueChange={(value) => handleInputChange({ target: { name: "store_id", value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-2 text-left">Nombre</th>
              <th className="px-6 py-2 text-left">Email</th>
              <th className="px-6 py-2 text-left">Rol</th>
              <th className="px-6 py-2 text-left">Tienda</th>
              <th className="px-6 py-2 text-left">Permisos</th>
              {userRole === 1 && <th className="px-6 py-2 text-left">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">{user.perfil?.name || "Sin nombre"}</td>
                <td className="px-6 py-4">{user.user?.email}</td>
                <td className="px-6 py-4">{user.perfil?.roles?.name || "Sin rol"}</td>
                <td className="px-6 py-4">{user.perfil?.store?.name || "Sin tienda"}</td>
                <td className="px-6 py-4">
                  {user.perfil?.permisos ? user.perfil.permisos.join(", ") : "Sin permisos"}
                </td>
                {userRole === 1 && (
                  <td className="px-6 py-4 space-x-2">
                    <Button onClick={() => handleEdit(user)} variant="outline">
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(user.id)} variant="destructive">
                      Eliminar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userRole !== 1 && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Necesitas permisos de administrador para gestionar usuarios.</p>
        </div>
      )}
    </div>
  )
}

export default Users

