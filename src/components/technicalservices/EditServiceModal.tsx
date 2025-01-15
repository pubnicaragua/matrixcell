import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";


interface Store {
  id: number;
  name: string;
}

interface Inventory {
  id: number;
  store_id: number;
  product_id: number;
  stock: number;
  products: {
    id: number;
    article: string;
    price: number;
  };
  imei: string;
}

interface Service {
  id: number;
  client: string;
  service_type: string; // Cambia de serviceType a service_type
  description: string;
  status: string;
  product_id: number;
  quantity: number;
  cost: number;
  store_id: number;
}


interface EditServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: (updatedService: Service) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState<Service | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (service) {
      setFormData(service);
      fetchStoresAndProducts(service.store_id);
    }
  }, [service]);

  const fetchStoresAndProducts = async (storeId: number) => {
    try {
      const storesRes = await api.get("/stores");

      const inventoriesRes = await api.get<Inventory[]>(`/inventories?store_id=${storeId}`); // Tipamos la respuesta
      setStores(storesRes.data);
      setInventories(inventoriesRes.data);

      const product = inventoriesRes.data.find(
        (item: Inventory) => item.product_id === service?.product_id
      );
      setSelectedProduct(product || null);
    } catch (error) {
      console.error("Error fetching stores/products:", error);
    }
  };

//
  const handleStoreChange = async (storeId: number) => {
    try {
      const response = await api.get(`/inventories?store_id=${storeId}`);
      setInventories(response.data);
      setSelectedProduct(null); // Reinicia el producto seleccionado
      setTotalCost(0); // Reinicia el costo total solo si cambias de tienda
      setFormData((prevFormData) => ({
        ...prevFormData!,
        store_id: storeId,
        product_id: 0, // Limpia el producto si cambia la tienda
        quantity: 0,
        cost: 0,
      }));
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  const handleProductChange = (productId: number) => {
    const product = inventories.find((item) => item.product_id === productId);

    if (product && formData) {
      setSelectedProduct(product);
      const newQuantity = formData.quantity > 0 ? formData.quantity : 1; // Mantén la cantidad existente o establece 1
      const newCost = product.products.price * newQuantity; // Recalcula el costo total
      setFormData({
        ...formData,
        product_id: product.product_id,
        quantity: newQuantity,
        cost: newCost,
      });
      setTotalCost(newCost);
    }
  };


  const handleQuantityChange = (qty: number) => {
    if (!selectedProduct || !formData) return;

    const productCost = selectedProduct.products.price * qty;
    setFormData({ ...formData, quantity: qty, cost: productCost });
    setTotalCost(productCost);
  };

  const handleSave = async () => {
    if (!formData) return;
  
    try {
      const product = inventories.find((item) => item.product_id === formData.product_id);
  
      if (product) {
        const updatedStock = product.stock + (service!.quantity - formData.quantity);
  
        await api.put(`/inventories/${product.id}`, {
          product_id: product.products.id,
          cantidad: updatedStock,
          store_id: formData.store_id,
        });
      }
  
      const response = await api.put(`/technical_services/${formData.id}`, formData);
  
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar el servicio o actualizar el inventario.");
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="store" className="text-right">
              Tienda
            </Label>
            <Select
              value={formData.store_id.toString()}
              onValueChange={(value) => handleStoreChange(Number(value))}
            >
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product" className="text-right">
              Producto
            </Label>
            <Select
              value={formData.product_id.toString()}
              onValueChange={(value) => handleProductChange(Number(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                {inventories.map((item) => (
                  <SelectItem key={item.product_id} value={item.product_id.toString()}>
                    {item.products.article}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProduct && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Precio por unidad</Label>
                <span className="col-span-3">${selectedProduct.products.price}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Stock disponible</Label>
                <span className="col-span-3">{selectedProduct.stock}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min="1"
                  max={selectedProduct.stock}
                  className="col-span-3"
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Costo Total</Label>
            <span className="col-span-3">${totalCost.toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
