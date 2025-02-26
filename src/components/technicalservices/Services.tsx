import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

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

const TechnicalServices: React.FC = () => {
  const { userRole, userStore } = useAuth(); // Mueve esto dentro del componente

  const [stores, setStores] = useState<Store[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [serviceDetails, setServiceDetails] = useState<any | null>(null);
  const [imei, setImei] = useState<string>("");
  const [formData, setFormData] = useState({
    client: "",
    serviceType: "",
    description: "",
    status: "Pendiente",
    product_id: 0,
    quantity: 0,
    service_price: 0,
  });

  useEffect(() => {
    if (selectedProduct) {
      const productCost = selectedProduct.products.price * formData.quantity;
      const serviceCost = formData.serviceType === "reparación" ? formData.service_price : 0;
      setTotalCost(productCost + serviceCost);
    }
  }, [formData.service_price, formData.quantity, selectedProduct, formData.serviceType]);

  //ACTUALIZADO
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");
        setStores(userRole === 1 ? response.data : response.data.filter((store: { id: number | null; }) => store.id === userStore));
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, [userRole, userStore]);

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
    const product = inventories.find(
      (inventory) => inventory.product_id === productId
    ) || null;

    if (product) {
      setSelectedProduct(product);
      setFormData({
        ...formData,
        product_id: product.product_id, // Nombre del producto
        quantity: 1, // Valor inicial
      });
      setQuantity(1);
      setTotalCost(product.products.price + formData.service_price); // Precio inicial
    }
  };


  const handleQuantityChange = (qty: number) => {
    if (selectedProduct) {
      const itemCost = qty * selectedProduct.products.price;
      const total = itemCost + (formData.serviceType === "reparación" ? formData.service_price : 0);
      setQuantity(qty);
      setTotalCost(total);
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
        product_id: formData.product_id, // Nombre del producto
        quantity, // Cantidad seleccionada
        //service_price: formData.serviceType === "reparación" ? formData.service_price : 0,
        cost: totalCost, // Precio total
        store_id: selectedStore,
      });

      // Calcular el nuevo stock restante
      const updatedStock = selectedProduct.stock - quantity;

      try {
        const response = await api.put(`/inventories/${selectedProduct.product_id}`, {
          product_id: selectedProduct.products.id,
          stock: updatedStock,
          store_id: selectedStore,
          imei: imei,
        });
        console.log("Respuesta del servidor:", response.data);
      } catch (error: any) {
        console.error("Error actualizando inventario:", error.response?.data || error.message);
      }


      alert("Servicio guardado exitosamente.");

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
      setFormData({
        client: "",
        serviceType: "",
        description: "",
        status: "Pendiente",
        product_id: 0,
        quantity: 0,
        service_price: 0
      });
      setSelectedStore(null);
      setSelectedProduct(null);
      setQuantity(0);
      setTotalCost(0);
      setImei("");
      alert("Servicio guardado exitosamente.");
    } catch (err: any) {
      console.error("Error guardando el servicio:", err);

      let errorMessage = "Ocurrió un error, por favor intenta nuevamente.";

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.error || "Datos incorrectos, revisa la información ingresada.";
        } else if (err.response.status === 500) {
          errorMessage = "Error interno del servidor, intenta más tarde.";
        }
      }

      alert(errorMessage);
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
          <label htmlFor="client">IMEI</label>
          <input
            id="imei"
            type="text"
            placeholder="IMEI"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={imei}
            maxLength={15} // Limita a 15 caracteres
            onChange={(e) => setImei(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="serviceType">Tipo de Servicio</label>
          <select
            id="serviceType"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={formData.serviceType}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceType: e.target.value,
                service_price: e.target.value === "venta" ? 0 : formData.service_price,
              })
            }
            required
          >
            <option value="">Seleccione el tipo de servicio</option>
            <option value="reparación">Reparación</option>
            <option value="venta">Venta de Artículo</option>
          </select>
        </div>

        <div>
          <label htmlFor="service_price">Precio del Servicio</label>
          <input
            id="service_price"
            type="number"
            step="0.01"
            className="block w-full p-3 rounded-lg border border-gray-300"
            value={formData.service_price}
            onChange={(e) =>
              setFormData({ ...formData, service_price: parseFloat(e.target.value) })
            }
            min="0"
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

          {userRole !== 1 && <span className="text-gray-500 text-sm"> (Tienda asignada)</span>}

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

            <div>
              <label htmlFor="service_price">Precio del Servicio</label>
              <input
                id="service_price"
                type="number"
                step="0.01"
                className="block w-full p-3 rounded-lg border border-gray-300"
                value={formData.service_price}
                onChange={(e) => setFormData({ ...formData, service_price: parseFloat(e.target.value) })}
                min="0"
                required
              />
            </div>
            <p>
              <strong>Costo total:</strong> ${formData.service_price + selectedProduct.products.price}
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