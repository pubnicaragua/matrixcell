import { Request, Response } from "express";
import supabase from "../config/supabaseClient";

export const CategoryController = {
    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const { data, error } = await supabase  
                .from("categories")
                .select("id, name, code");

            if (error) {
                console.error("Error al obtener categorías:", error);
                res.status(500).json({ error: "Error al obtener categorías" });
                return;
            }

            res.status(200).json(data);
        } catch (error) {
            console.error("Error en la consulta de categorías:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const { data, error } = await supabase
                .from("categories")
                .select("id, name, code")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error al obtener categoría:", error);
                res.status(404).json({ error: "Categoría no encontrada" });
                return;
            }

            res.status(200).json(data);
        } catch (error) {
            console.error("Error en la consulta de categoría:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};
