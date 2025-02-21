import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { InventoryItem } from "../../types"

interface Store {
  id: number
  name: string
}

interface InventoryTableProps {
  inventory: InventoryItem[]
  loading: boolean
  editingItem: InventoryItem | null
  editingStock: number
  setEditingStock: (value: number) => void
  selectedStore: number | string
  stores: Store[]
  userRole: number
  userStore: number | null
  handleStoreChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleMoveStore: (itemId: number, cantidad: number, product_id: number) => void
  handleEditClick: (item: InventoryItem) => void
  handleEditSubmit: () => void
  handleEditCancel: () => void
  handleDelete: (itemId: number) => void
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  loading,
  editingItem,
  editingStock,
  setEditingStock,
  selectedStore,
  stores,
  userRole,
  userStore,
  handleStoreChange,
  handleMoveStore,
  handleEditClick,
  handleEditSubmit,
  handleEditCancel,
  handleDelete,
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>

          <TableHead>Producto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>IMEI</TableHead>
          <TableHead>Precio del Cliente</TableHead>

          <TableHead>Stock</TableHead>
          <TableHead>Tienda</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item) => (
          <TableRow key={item.id}>

            <TableCell>{item.products.article}</TableCell>
            <TableCell>{item.products.categories.name}</TableCell>
            <TableCell>{item.imei}</TableCell>
            <TableCell>{item.products.price}</TableCell>

            <TableCell>
              {editingItem?.id === item.id ? (
                <Input
                  type="number"
                  value={editingStock}
                  onChange={(e) => setEditingStock(Number(e.target.value))}
                  className="w-20"
                />
              ) : (
                item.stock
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span>{item.store.name}</span>
                <Select
                  value={selectedStore.toString()}
                  onValueChange={(value) => handleStoreChange({ target: { value } } as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona una tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRole === 1
                      ? stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))
                      : stores
                        .filter((store) => store.id === userStore)
                        .map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                {userRole !== 1 && <span className="text-gray-500 text-sm">(Tienda asignada)</span>}
                <Button
                  onClick={() => handleMoveStore(item.store.id, item.stock, item.product_id)}
                  variant="move"
                  size="sm"
                >
                  Move
                </Button>
              </div>
            </TableCell>
            <TableCell>
              {editingItem?.id === item.id ? (
                <div className="space-x-2">
                  <Button onClick={handleEditSubmit} variant="success" size="sm">
                    Save
                  </Button>
                  <Button onClick={handleEditCancel} variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Button onClick={() => handleEditClick(item)} variant="edit" size="sm">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default InventoryTable

