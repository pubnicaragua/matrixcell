import { Request,Response } from "express";
import { PaymentPlan } from "../models/paymentPlan.model";
import { BaseService } from "../services/base.service";
import { validatePaymentPlan } from "../requests/paymentPlan.request";
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
    async createPaymentPlan(req: Request, res: Response) {
        try {
            const { price, downPaymentPlan, device_id } = req.body;
            validatePaymentPlan(req.body); // Validar los datos
            // Calcular saldo restante
            const remainingBalance = price - downPaymentPlan;
            // Configuración de los planes de pago
            const plans = [3, 6]; // Plazos en meses
            const interestRate = 0.05; // 5% de interés mensual
           const paymentPlanRecords = plans.map((months) => {
                const totalCost = remainingBalance * (1 + interestRate * months); // Costo total con interés
                const monthlyPayment = totalCost / months; // Pago mensual
                const weeklyPayment = monthlyPayment / 4.33; // Pago semanal (aproximado)
    
                const paymentPlan = new PaymentPlan();
                paymentPlan.device_id = device_id;
                paymentPlan.months = months;
                paymentPlan.weekly_payment = parseFloat(weeklyPayment.toFixed(2));
                paymentPlan.monthly_payment = parseFloat(monthlyPayment.toFixed(2));
                paymentPlan.total_cost = parseFloat(totalCost.toFixed(2));
                paymentPlan.created_at = new Date();
    
                return paymentPlan;
            });
    
            // Guardar cada registro individualmente en la base de datos
            const savedPlans = [];
            for (const plan of paymentPlanRecords) {
                const savedPlan = await BaseService.create<PaymentPlan>("payment_plans", plan);
                savedPlans.push(savedPlan);
            }
    
            // Devolver la respuesta
             res.status(200).json(savedPlans);
        } catch (error: any) {
            // Manejo de errores
            console.error("Error al crear el plan de pagos:", error);
             res.status(400).json({
                message: error.message,
            });
        }
    }
    
    
    
}
