import { Request, Response } from "express";
import { Status } from "../models/status.model";
import { validateStatus } from "../requests/status.request";
import { BaseService } from "../services/base.service";
import { StatusResource } from "../resources/status.resource";
const tableName = 'status'; // Nombre de la tabla en la base de datos
export const StatusController = {
    async getAllStatuss(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const statuss = await BaseService.getAll<Status>(tableName,['id', 'client_id', 'total_operations','total_due','total_overdue','judicial_operations','status','last_payment_date'],where);
            res.json(StatusResource.formatStatuss(statuss));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createStatus(req: Request, res: Response) {
        try {
            validateStatus(req.body); // Validar los datos
            const { userId } = req;
            const status = await BaseService.create<Status>(tableName, req.body, userId);
            res.status(201).json(StatusResource.formatStatus(status));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateStatus(req.body); // Validar los datos
            const { userId } = req;
            const status = await BaseService.update<Status>(tableName, parseInt(id), req.body, userId);
            res.json(StatusResource.formatStatus(status));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Status>(tableName, id, userId);
            res.json({ message: 'Status eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}