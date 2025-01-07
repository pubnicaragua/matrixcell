import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { validateStore } from "../requests/store.request";
import { BaseService } from "../services/base.service";
import { StoreResource } from "../resources/store.resource";
const tableName = 'store'; // Nombre de la tabla en la base de datos
export const StoreController = {
    async getAllStores(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const stores = await BaseService.getAll<Store>(tableName,['id', 'name', 'address','phone','active'],where);
            res.json(StoreResource.formatStores(stores));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createStore(req: Request, res: Response) {
        try {
            validateStore(req.body); // Validar los datos
            const { userId } = req;
            const store = await BaseService.create<Store>(tableName, req.body, userId);
            res.status(201).json(StoreResource.formatStore(store));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateStore(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateStore(req.body); // Validar los datos
            const { userId } = req;
            const store = await BaseService.update<Store>(tableName, parseInt(id), req.body, userId);
            res.json(StoreResource.formatStore(store));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteStore(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Store>(tableName, id, userId);
            res.json({ message: 'Store eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}