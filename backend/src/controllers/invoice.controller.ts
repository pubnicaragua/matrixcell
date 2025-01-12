import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { InvoiceResource } from "../resources/invoice.recource";
import { Invoice } from "../models/invoice.model";
import { validateInvoice } from "../requests/invoice.request";
const tableName = 'invoices'; // Nombre de la tabla en la base de datos
export const InvoiceController = {
    async getAllInvoices(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const invoices = await BaseService.getAll<Invoice>(tableName,['id', 'number', 'amount','status','device_id', 'operation_id', 'created_at'],where);
            res.json(InvoiceResource.formatInvoices(invoices));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createInvoice(req: Request, res: Response) {
        try {
            validateInvoice(req.body); // Validar los datos
            const { userId } = req;
            const invoice = await BaseService.create<Invoice>(tableName, req.body, userId);
            res.status(201).json(InvoiceResource.formatInvoice(invoice));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateInvoice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateInvoice(req.body); // Validar los datos
            const { userId } = req;
            const invoice = await BaseService.update<Invoice>(tableName, parseInt(id), req.body, userId);
            res.json(InvoiceResource.formatInvoice(invoice));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteInvoice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Invoice>(tableName, id, userId);
            res.json({ message: 'Invoice eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}