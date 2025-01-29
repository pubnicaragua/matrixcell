import { Request,Response } from "express";
import { PaymentPlan } from "../models/paymentPlan.model";
import { BaseService } from "../services/base.service";
import { validatePaymentPlan } from "../requests/paymentPlan.request";
import supabase from "../config/supabaseClient";
const tableName = 'payment_plans'; // Nombre de la tabla en la base de datos

export const PaymentPlanController = {
async getAllPaymentPlans(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const paymentplans = await BaseService.getAll<PaymentPlan>(tableName,['id', 'device_id', 'months', 'weekly_payment', 'monthly_payment', 'total_cost', 'created_at'],where);
            res.json(paymentplans);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async updatePaymentPlan(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validatePaymentPlan(req.body); // Validar los datos
            const { userId } = req;
            const paymentplan = await BaseService.update<PaymentPlan>(tableName, parseInt(id), req.body, userId);
            res.json(paymentplan);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deletePaymentPlan(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<PaymentPlan>(tableName, id, userId);
            res.json({ message: 'PaymentPlan eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    async createPaymentPlan(req: Request, res: Response): Promise<void> {
        try {
            const {
                device_id,
                months,
                weekly_payment,
                monthly_payment,
                total_cost,
            } = req.body;
    
            const { data: paymentPlan, error } = await supabase
                .from("payment_plans")
                .insert([
                    {
                        device_id,
                        months,
                        weekly_payment,
                        monthly_payment,
                        total_cost,
                    },
                ])
                .select()
                .single();
    
            if (error) {
                console.error("Error de Supabase:", error);
                res.status(400).json({ message: error.message });
                return;
            }
    
            console.log("Plan de pago creado:", paymentPlan);
            res.status(201).json(paymentPlan);
        } catch (error: any) {
            console.error("Error interno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    
}
