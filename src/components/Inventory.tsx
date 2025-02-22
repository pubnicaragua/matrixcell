"use client"

import type React from "react"
import { useState, useEffect } from "react"
import supabase from "../api/supabase"
import api from "../axiosConfig"
import SearchFilters from "../components/inventory/SearchFilters"
import type { InventoryItem } from "../types"

interface FileInfo {
  name: string
  url: string
}

interface Store {
  id: number
  name: string
}

const Inventory: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedStore, setSelectedStore] = useState<number | string>("")
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [editingStock, setEditingStock] = useState<number>(0)
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [userRole, setUserRole] = useState<number>(0)
  const [userStore, setUserStore] = useState<number | null>(null)

  useEffect(() => {
    const perfil = localStorage.getItem("perfil")
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil)
      setUserRole(parsedPerfil.rol_id || 0)
      setUserStore(parsedPerfil.store_id || null)
      // Set the initial selected store for non-admin users
      if (parsedPerfil.rol_id !== 1 && parsedPerfil.store_id) {
        setSelectedStore(parsedPerfil.store_id)
      }
    }
  }, [])

  // Modificar el useEffect para que fetchInventory se ejecute cuando cambie userStore
  useEffect(() => {
    if (userRole !== 0 && userStore !== null) {
      fetchFiles()
      fetchInventory()

      if (userRole === 1) {
        fetchStores()
      }
    }
  }, [userRole, userStore]) // Agregar userStore como dependencia

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from("Inventarios").list()

      if (error) {
        throw error
      }

      if (data) {
        const fileInfos: FileInfo[] = await Promise.all(
          data.map(async (item) => {
            const { data: urlData } = supabase.storage.from("Inventarios").getPublicUrl(item.name)
            return {
              name: item.name,
              url: urlData.publicUrl,
            }
          }),
        )
        setFiles(fileInfos)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
      setError("Failed to fetch files")
    }
  }

  // Modificar el fetchInventory para filtrar por tienda del usuario
  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await api.get("/inventories")

      // Filtrar el inventario basado en el rol y la tienda del usuario
      const filteredData =
        userRole === 1 ? response.data : response.data.filter((item: InventoryItem) => item.store_id === userStore)

      setInventory(filteredData)

      const uniqueCategories = Array.from(
        new Set(filteredData.map((item: InventoryItem) => item.products.categories.name)),
      ).map((name) => ({
        id:
          filteredData.find((item: InventoryItem) => item.products.categories.name === name)?.products.categories.id ??
          0,
        name: String(name),
      }))

      setCategories(uniqueCategories)
    } catch (error) {
      setError("Error fetching inventory")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStores = async () => {
    try {
      const response = await api.get("/stores")
      setStores(response.data)
    } catch (error) {
      setError("Error fetching stores")
      console.error(error)
    }
  }

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item)
    setEditingStock(item.stock)
  }

  const handleEditSubmit = async () => {
    if (!editingItem) return

    try {
      const response = await api.put(`/inventories/${editingItem.id}`, {
        cantidad: editingStock,
        product_id: editingItem.product_id,
        imei: editingItem.imei,
        store_id: editingItem.store_id,
      })
      setInventory((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, stock: editingStock } : item)))
      await fetchInventory()
      setEditingItem(null)
      setError(null)
    } catch (error) {
      console.error("Failed to update item:", error)
      setError("Failed to update item")
    }
  }

  const handleEditCancel = () => {
    setEditingItem(null)
    setEditingStock(0)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const { error } = await supabase.storage.from("Inventarios").upload(file.name, file)

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage.from("Inventarios").getPublicUrl(file.name)

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to retrieve public URL")
      }

      const formData = new FormData()
      formData.append("file", file)

      await api.post("/products/masive-insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      await fetchFiles()
      await fetchInventory()
      setFile(null)
    } catch (error) {
      console.error("Error during file upload:", error)
      setError("Failed to upload and process file")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      setError("Failed to download file")
    }
  }

  const handleMoveStore = async (itemId: number, cantidad: number, product_id: number) => {
    if (!selectedStore) {
      setError("Please select a store to move inventory")
      return
    }

    try {
      const response = await api.post("/inventories/store-moved", {
        product_id,
        origen_store: itemId,
        destino_store: selectedStore,
        cantidad,
      })

      const updatedStore = stores.find((store) => store.id === selectedStore)

      if (!updatedStore) {
        setError("Store not found")
        return
      }

      setInventory((prev) => prev.map((item) => (item.id === itemId ? { ...item, store: updatedStore } : item)))
      await fetchInventory()
      setSelectedStore("")
      setError(null)
    } catch (error) {
      setError("Failed to move item to the new store")
      console.error(error)
    }
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Only allow store changes for admin users
    if (userRole === 1) {
      setSelectedStore(Number(e.target.value))
    }
  }

  const handleDelete = async (itemId: number) => {
    try {
      await api.delete(`/inventories/${itemId}`)
      setInventory((prev) => prev.filter((item) => item.id !== itemId))
      setError(null)
    } catch (error) {
      setError("Failed to delete item")
      console.error(error)
    }
  }

  const handleSearch = (searchTerm: string, category?: string) => {
    let filtered = inventory.filter((item) => item.products.article.toLowerCase().includes(searchTerm.toLowerCase()))

    if (category && category !== "") {
      filtered = filtered.filter((item) => item.products.categories.name === category)
    }

    setFilteredInventory(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    handleSearch("", category)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Gestión de Inventario</h1>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Subir archivo</h2>
        <input type="file" onChange={handleFileChange} className="border border-gray-300 rounded-lg p-2 mb-4 w-full" />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Uploaded Files List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Archivos cargados:</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="flex justify-between items-center mb-4">
              <span className="text-gray-700">{file.name}</span>
              <button
                onClick={() => handleDownload(file.url, file.name)}
                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-all"
              >
                Descargar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Inventory Management */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Inventario</h2>

        {/* Search and Filters */}
        <SearchFilters
          onSearch={(searchTerm) => handleSearch(searchTerm, selectedCategory)}
          onCategoryChange={handleCategoryChange}
          categories={categories ?? []}
        />

        {/* Inventory Table */}
        <table className="table-auto w-full mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Categoria</th>
              <th className="px-4 py-2 text-left">IMEI</th>
              <th className="px-4 py-2 text-left">Precio del cliente</th>
              <th className="px-4 py-2 text-left">Precio del vendedor</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Tienda</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              (filteredInventory.length > 0 ? filteredInventory : inventory).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{item.products.article}</td>
                  <td className="px-4 py-2">{item.products.categories.name}</td>
                  <td className="px-4 py-2">{item.imei}</td>
                  <td className="px-4 py-2">
                    ${item.products.price != null ? item.products.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2">
                    ${item.products.busines_price != null ? item.products.busines_price.toFixed(2) : "0.00"}
                  </td>

                  <td className="px-4 py-2">
                    {editingItem?.id === item.id ? (
                      <input
                        type="number"
                        value={editingStock}
                        onChange={(e) => setEditingStock(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                      />
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span>{item.store.name}</span>

                    {/* Mostrar el select solo si el usuario es admin */}
                    {userRole === 1 ? (
                      <>
                        <select
                          value={selectedStore || ""}
                          onChange={handleStoreChange}
                          className="border border-gray-300 rounded-lg px-2 py-1 mt-2 w-full"
                        >
                          <option value="">Selecciona una tienda</option>
                          {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                              {store.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleMoveStore(item.store.id, item.stock, item.product_id)}
                          className="bg-green-500 text-white px-2 py-1 rounded-lg mt-2 w-full hover:bg-green-600 transition-all"
                        >
                          Mover
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm block mt-2">Tienda asignada: {item.store.name}</span>
                    )}
                  </td>

                  <td className="px-4 py-2 flex gap-2">
                    {editingItem?.id === item.id ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Borrar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory
