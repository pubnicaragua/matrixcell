"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import api from "../../axiosConfig";

interface Store {
    id: number;
    name: string;
}

interface AddProductModalProps {
    userRole: number;
    userStore: number | null;
    stores: Store[];
    onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ userRole, userStore, stores, onProductAdded }) => {
    const [open, setOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [selectedStore, setSelectedStore] = useState<number | null>(userStore);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [models, setModels] = useState<{ id: number; name: string }[]>([]);
    const [selectedModel, setSelectedModel] = useState("");

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const response = await api.get("products/models"); // Nueva ruta para obtener modelos
            setModels(response.data);
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/inventories");
            const uniqueCategories = Array.from(
                new Set(response.data.map((item: any) => item.products.categories.name))
            ).map((name) => ({
                id: response.data.find((item: any) => item.products.categories.name === name)?.products.categories.id ?? 0,
                name: String(name),
            }));
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) {
            console.error("No se ha seleccionado ninguna categoría");
            return;
        }

        try {
            await api.post("/inventories", {
                article: productName,
                price: Number(price),
                model_id: Number(selectedModel),
                category_id: Number(category),
                stock: Number(stock),
                store_id: userRole === 1 ? selectedStore : userStore,
            });


            onProductAdded();
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const resetForm = () => {
        setProductName("");
        setCategory("");
        setPrice("");
        setStock("");
        setSelectedStore(userStore);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Agregar Producto</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="productName">Nombre del Producto</Label>
                            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="category">Categoría</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length === 0 ? (
                                        <SelectItem disabled value="">No hay categorías</SelectItem>
                                    ) : (
                                        categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="model">Modelo</Label>
                            <Select value={selectedModel || ""} onValueChange={setSelectedModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un modelo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.length === 0 ? (
                                        <SelectItem disabled value="null">No hay modelos disponibles</SelectItem>
                                    ) : (
                                        models.map((model) => (
                                            <SelectItem key={model.id} value={model.id.toString()}>
                                                {model.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>

                        </div>

                        <div>
                            <Label htmlFor="price">Precio</Label>
                            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </div>
                        {userRole === 1 && (
                            <div>
                                <Label htmlFor="store">Tienda</Label>
                                <Select
                                    value={selectedStore?.toString()}
                                    onValueChange={(value) => setSelectedStore(Number.parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una tienda" />
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
                        )}
                        <Button type="submit">Agregar Producto</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddProductModal;