import { Request, Response } from "express";
import { TechnicalService } from "../models/technicalServicemodel";
import { validateTechnicalService } from "../requests/technicalService.request";
import { TechnicalServiceResource } from "../resources/technicalService.resource";
import { BaseService } from "../services/base.service";

const tableName = 'technical_services'; // Nombre de la tabla en la base de datos
export const TechnicalServiceController = {
    async getAllTechnicalServices(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const technicalservices = await BaseService.getAll<TechnicalService>(tableName,['id', 'client','service_type','description','status','cost','store_id', 'product_id', 'quantity'],where);
            console.log(technicalservices)
            res.json(technicalservices);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createTechnicalService(req: Request, res: Response) {
        try {
            validateTechnicalService(req.body); // Validar los datos
            const { userId } = req;
            const technicalservice = await BaseService.create<TechnicalService>(tableName, req.body, userId);
            res.status(201).json(TechnicalServiceResource.formatTechnicalService(technicalservice));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateTechnicalService(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateTechnicalService(req.body); // Validar los datos
            const { userId } = req;
            const technicalservice = await BaseService.update<TechnicalService>(tableName, parseInt(id), req.body, userId);
            res.json(TechnicalServiceResource.formatTechnicalService(technicalservice));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteTechnicalService(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<TechnicalService>(tableName, id, userId);
            res.json({ message: 'TechnicalService eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}