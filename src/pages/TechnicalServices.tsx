import React, { useEffect, useState } from "react";
import api from "../axiosConfig";

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
}

const TechnicalServices: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(null);
  const [selectedItem, setselectedItem] = useState<Inventory | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [serviceDetails, setServiceDetails] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    client: "",
    serviceType: "",
    description: "",
    status: "Pendiente",
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleStoreChange = async (storeId: number) => {
    setSelectedStore(storeId);
    setSelectedProduct(null);
    setQuantity(0);
    setTotalCost(0);
    try {
      const response = await api.get(`/inventories?store_id=${storeId}`);
      setInventories(response.data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  const handleProductChange = (productId: number) => {
    const product = inventories.find((inventory) => inventory.product_id === productId) || null;
    setSelectedProduct(product);
    setQuantity(0);
    setTotalCost(0);
  };

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    if (selectedProduct) {
      setTotalCost(qty * selectedProduct.products.price);
    }
  };

  const handleSaveService = async () => {
  if (!selectedStore || !selectedProduct || quantity <= 0 || !formData.client) {
    alert("Debe completar todos los campos requeridos.");
    return;
  }

  try {
    // Guardar el servicio en la tabla `technical_services`
    await api.post("/technical_services", {
      client: formData.client,
      service_type: formData.serviceType,
      description: formData.description,
      status: formData.status,
      cost: totalCost,
      store_id: selectedStore, // ID de la tienda
    });

    // Calcular el nuevo stock restante
    const updatedStock = selectedProduct.stock - quantity;

    // Actualizar el stock en la tabla `inventories`
    await api.put(`/inventories/${selectedProduct.id}`, {
      product_id: selectedProduct.products.id, // ID del producto
      cantidad: updatedStock, // Cantidad restante
      store_id: selectedStore
    });

    // Actualizar el resumen del servicio
    setServiceDetails({
      client: formData.client,
      serviceType: formData.serviceType,
      description: formData.description,
      status: formData.status,
      costPerItem: selectedProduct.products.price,
      store: stores.find((store) => store.id === selectedStore)?.name || "",
      total: totalCost,
    });

    // Reiniciar el formulario
    setFormData({ client: "", serviceType: "", description: "", status: "Pendiente" });
    setSelectedStore(null);
    setSelectedProduct(null);
    setQuantity(0);
    setTotalCost(0);
    alert("Servicio guardado exitosamente.");
  } catch (error) {
    console.error("Error saving service or updating inventory:", error);
    alert("Error al guardar el servicio o actualizar el inventario.");
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">
        Servicios Técnicos
      </h1>

      {/* Formulario */}
      <div className="space-y-4">
        <div>
          <label htmlFor="client">Cliente</label>
          <input
            id="client"
            type="text"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="serviceType">Tipo de Servicio</label>
          <input
            id="serviceType"
            type="text"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Tiendas */}
        <div>
          <label htmlFor="store">Seleccionar Tienda</label>
          <select
            id="store"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={selectedStore || ""}
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

        {/* Productos */}
        {selectedStore && (
          <div>
            <label htmlFor="product">Seleccionar Producto</label>
            <select
              id="product"
              className="block w-full p-3 rounded-lg border border-gray-300"
              value={selectedProduct?.product_id || ""}
              onChange={(e) => handleProductChange(Number(e.target.value))}
            >
              <option value="">Seleccione un producto</option>
              {inventories.map((inventory) => (
                <option key={inventory.product_id} value={inventory.product_id}>
                  {inventory.products.article}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Detalles del Producto */}
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
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              min="1"
              max={selectedProduct.stock}
              required
            />
            <p>
              <strong>Costo total:</strong> ${totalCost.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSaveService}
        className="w-full mt-6 py-3 text-white font-bold bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Guardar Servicio
      </button>

      {/* Resumen del Servicio */}
      {serviceDetails && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Resumen del Servicio</h2>
          <p>
            <strong>Cliente:</strong> {serviceDetails.client}
          </p>
          <p>
            <strong>Tipo de Servicio:</strong> {serviceDetails.serviceType}
          </p>
          <p>
            <strong>Descripción:</strong> {serviceDetails.description}
          </p>
          <p>
            <strong>Estado:</strong> {serviceDetails.status}
          </p>
          <p>
            <strong>Costo por Artículo:</strong> ${serviceDetails.costPerItem}
          </p>
          <p>
            <strong>Tienda:</strong> {serviceDetails.store}
          </p>
          <p>
            <strong>Total:</strong> ${serviceDetails.total.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicalServices;
