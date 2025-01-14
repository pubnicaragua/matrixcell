import React, { useState, useEffect } from "react";
import api from "../axiosConfig";

interface Inventory {
    id: number;
    store_id: number;
    product_id: number;
    stock: number;
    created_at: string;
    products: {
        id: number;
        price: number;
        busines_price:number;
        models: {
            id: number;
            name: string;
        };
        article: string;
    };
    store: {
        id: number;
        name: string;
    };
}


const InventoryList = () => {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await api.get("/inventories");
                setInventories(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching inventories:", err);
                setError("Error al obtener los datos del inventario.");
                setLoading(false);
            }
        };

        fetchInventories();
    }, []);

    if (loading) return <p>Cargando inventarios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Lista de Inventarios
            </h1>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tienda</th>
                        <th className="border px-4 py-2">Producto</th>
                        <th className="border px-4 py-2">Modelo</th>
                        <th className="border px-4 py-2">Artículo</th>
                        <th className="border px-4 py-2">Precio</th>
                        <th className="border px-4 py-2">Stock</th>
                        <th className="border px-4 py-2">Fecha de Creación</th>
                    </tr>
                </thead>
                <tbody>
                    {inventories.map((inventory) => (
                        <tr key={inventory.id} className="text-center">
                            <td className="border px-4 py-2">{inventory.id}</td>
                            <td className="border px-4 py-2">{inventory.store.name}</td>
                            <td className="border px-4 py-2">{inventory.products.article}</td>
                            <td className="border px-4 py-2">{inventory.products.models.name}</td>
                            <td className="border px-4 py-2">{inventory.products.article}</td>
                            <td className="border px-4 py-2">${inventory.products.price}</td>
                            <td className="border px-4 py-2">{inventory.stock}</td>
                            <td className="border px-4 py-2">
                                {new Date(inventory.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;
