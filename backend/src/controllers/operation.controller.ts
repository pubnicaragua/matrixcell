import { Request, Response } from "express";
import { Operation } from "../models/operation.model";
import { validateOperation } from "../requests/operation.request";
import { BaseService } from "../services/base.service";
import { OperationResource } from "../resources/operation.resource";
const tableName = 'operations'; // Nombre de la tabla en la base de datos
export const OperationController = {
    async getAllOperations(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const operations = await BaseService.getAll<Operation>(tableName, [
                'id',
                'operation_number', 
                'operation_value', 
                'due_date', 
                'amount_due', 
                'amount_paid', 
                'days_overdue', 
                'cart_value', 
                'refinanced_debt', 
                'judicial_action', 
                'created_at', 
                'updated_at', 
                'client_id', 
                'clients(id, name, phone, deadline, grant_date)'], where);
            
            res.json(operations);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createOperation(req: Request, res: Response) {
        try {
            validateOperation(req.body); // Validar los datos
            const { userId } = req;
            const operation = await BaseService.create<Operation>(tableName, req.body, userId);
            res.status(201).json(OperationResource.formatOperation(operation));
           
            // console.log(req.body)
            // console.log(operation)
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateOperation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateOperation(req.body); // Validar los datos
            
            const { userId } = req;
            const operation = await BaseService.update<Operation>(tableName, parseInt(id), req.body, userId);
            // console.log(id)
            // console.log(req.body)
            // console.log(operation)
            res.json(OperationResource.formatOperation(operation));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteOperation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Operation>(tableName, id, userId);
            res.json({ message: 'Operation eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}