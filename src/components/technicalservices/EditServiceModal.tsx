import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";

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
  serviceType: string;
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
      // Encuentra el producto seleccionado en el inventario
      const product = inventories.find((item) => item.product_id === formData.product_id);
  
      if (product) {
        // Calcula el stock actualizado
        const updatedStock = product.stock + (service!.quantity - formData.quantity);
  
        // Realiza la solicitud PUT para actualizar el inventario
        await api.put(`/inventories/${product.id}`, {
          product_id: product.products.id, // ID del producto desde el inventario
          cantidad: updatedStock, // Cantidad restante calculada
          store_id: formData.store_id, // Tienda seleccionada desde formData
         // imei: product.imei || imei, // IMEI del producto (asegúrate de que `imei` esté definido)
        });
      }
  
      // Realiza la solicitud PUT para actualizar el servicio
      const response = await api.put(`/technical_services/${formData.id}`, formData);
  
      // Llama al callback onSave con los datos actualizados
      onSave(response.data);
  
      // Cierra el modal
      onClose();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar el servicio o actualizar el inventario.");
    }
  };
  

  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Editar Servicio</h2>
        <div className="space-y-4">
          <div>
            <label>Cliente</label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="store">Seleccionar Tienda</label>
            <select
              id="store"
              className="block w-full p-3 rounded-lg border border-gray-300"
              value={formData.store_id || ""}
              onChange={(e) => handleStoreChange(Number(e.target.value))}
            >
              <option value="">Seleccione una tienda</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product">Seleccionar Producto</label>
            <select
              id="product"
              className="block w-full p-3 rounded-lg border border-gray-300"
              value={formData.product_id || ""}
              onChange={(e) => handleProductChange(Number(e.target.value))}
            >
              <option value="">Seleccione un producto</option>
              {inventories.map((item) => (
                <option key={item.product_id} value={item.product_id}>
                  {item.products.article}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div>
              <p>
                <strong>Precio por unidad:</strong> ${selectedProduct.products.price}
              </p>
              <p>
                <strong>Stock disponible:</strong> {selectedProduct.stock}
              </p>
              <label htmlFor="quantity">Cantidad</label>
              <input
                id="quantity"
                type="number"
                className="block w-full p-3 rounded-lg border border-gray-300"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                min="1"
                max={selectedProduct.stock}
              />
            </div>
          )}

          <p>
            <strong>Costo Total:</strong> ${totalCost.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
