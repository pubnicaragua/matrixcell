import { Request, Response } from "express";
import { Payment } from "../models/payment.model";
import { validatePayment } from "../requests/payment.request";
import { BaseService } from "../services/base.service";
import { PaymentResource } from "../resources/payment.resource";
const tableName = 'payments'; // Nombre de la tabla en la base de datos
export const PaymentController = {
    async getAllPayments(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const payments = await BaseService.getAll<Payment>(tableName,['id', 'operation_id', 'client_id','payment_date','amount_paid','payment_method','receipt_number','created_at','updated_at'],where);
            res.json(PaymentResource.formatPayments(payments));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createPayment(req: Request, res: Response) {
        try {
            validatePayment(req.body); // Validar los datos
            const { userId } = req;
            const payment = await BaseService.create<Payment>(tableName, req.body, userId);
            res.status(201).json(PaymentResource.formatPayment(payment));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updatePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validatePayment(req.body); // Validar los datos
            const { userId } = req;
            const payment = await BaseService.update<Payment>(tableName, parseInt(id), req.body, userId);
            res.json(PaymentResource.formatPayment(payment));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Payment>(tableName, id, userId);
            res.json({ message: 'Payment eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}