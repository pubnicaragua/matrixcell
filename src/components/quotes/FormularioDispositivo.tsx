"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { PlusCircle, X } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

// Define the Inventory interface
interface Inventory {
  id: number
  store_id: number
  product_id: number
  stock: number
  products: {
    id: number
    article: string
    price: number
  }
  imei: string
}

interface Store {
  id: number
  name: string
}

interface FormularioDispositivoProps {
  onDeviceSelect: (device: { id: number; price: number; marca: string; modelo: string }) => void
}

const DeviceSelector: React.FC<FormularioDispositivoProps> = ({ onDeviceSelect }) => {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [newProduct, setNewProduct] = useState({ article: "", price: "", store_id: "", stock: "1" })
  const [showAddForm, setShowAddForm] = useState(false)
  const { userRole, userStore } = useAuth()

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      fetchInventory(selectedStore)
    }
  }, [selectedStore])

  const fetchStores = async () => {
    try {
      const response = await axios.get("/stores")
      setStores(response.data)

      // Si el usuario no es admin, establecer automáticamente su tienda asignada
      if (userRole !== 1 && userStore) {
        setSelectedStore(userStore)
        fetchInventory(userStore)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const fetchInventory = async (storeId: number) => {
    try {
      const response = await axios.get(`/inventories?store_id=${storeId}`)
      console.log("Inventory data:", response.data)
      // Filter inventory to only include those with products
      const filteredInventory = response.data.filter(
        (inv: Inventory) => inv.products && inv.products.article && inv.products.article.trim() !== "",
      )
      setInventories(filteredInventory)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const handleSelectProduct = (id: string) => {
    const inventory = inventories.find((inv) => inv.product_id === Number.parseInt(id))
    if (inventory) {
      onDeviceSelect({
        id: inventory.product_id,
        price: inventory.products.price,
        marca: "", // You might need to adjust this based on your data structure
        modelo: inventory.products.article,
      })
      setSelectedProductId(inventory.product_id)
    }
  }

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(Number.parseInt(storeId))
    setNewProduct({ ...newProduct, store_id: storeId })
  }

  const handleAddProduct = async () => {
    const { article, price, store_id, stock } = newProduct
    if (!article || !price || !store_id) {
      alert("Por favor, complete todos los campos.")
      return
    }

    try {
      // First create the product
      const productResponse = await axios.post("/products", {
        article,
        price: Number.parseFloat(price),
      })

      console.log("Product created:", productResponse.data)

      // Then add it to inventory
      await axios.post("/inventories", {
        product_id: productResponse.data.id,
        store_id: Number.parseInt(store_id),
        stock: Number.parseInt(stock),
      })

      // Refresh inventory
      fetchInventory(Number.parseInt(store_id))
      setNewProduct({ article: "", price: "", store_id, stock: "1" })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding new product:", error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Selecciona un Dispositivo</CardTitle>
        <CardDescription>Elige un dispositivo existente o agrega uno nuevo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store">Tienda</Label>
            <Select
              onValueChange={(value) => setSelectedStore(Number.parseInt(value))}
              value={selectedStore?.toString() || ""}
              disabled={userRole !== 1} // Deshabilitar si no es admin
            >
              <SelectTrigger className="w-full">
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
            {userRole !== 1 && userStore && (
              <p className="text-sm text-muted-foreground">Tienda asignada a tu usuario</p>
            )}
          </div>

          {selectedStore && (
            <div className="space-y-2">
              <Label htmlFor="product">Dispositivo</Label>
              <Select onValueChange={handleSelectProduct} value={selectedProductId?.toString() || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {inventories.map((inventory) => (
                    <SelectItem key={inventory.product_id} value={inventory.product_id.toString()}>
                      {inventory.products.article} (${inventory.products.price}) - Stock: {inventory.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!selectedProductId && selectedStore && (
            <div className="mt-4">
              <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" className="w-full">
                {showAddForm ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Nuevo
                  </>
                )}
              </Button>

              {showAddForm && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Agregar Nuevo Dispositivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="article">Nombre/Modelo</Label>
                        <Input
                          id="article"
                          name="article"
                          placeholder="Nombre o modelo del dispositivo"
                          value={newProduct.article}
                          onChange={handleNewProductChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="Precio"
                          value={newProduct.price}
                          onChange={handleNewProductChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Cantidad</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          placeholder="Cantidad"
                          value={newProduct.stock}
                          onChange={handleNewProductChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store_id">Tienda</Label>
                        <Select
                          onValueChange={handleStoreChange}
                          value={newProduct.store_id}
                          disabled={userRole !== 1} // Deshabilitar si no es admin
                        >
                          <SelectTrigger className="w-full">
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
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddProduct} className="w-full">
                      Agregar Dispositivo
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceSelector

