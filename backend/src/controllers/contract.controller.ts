import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { Contract } from "../models/contract.model";
import { validateContract } from "../requests/contract.request";
import { calculateNextPaymentDate } from "../services/contract.service";
import supabase from "../config/supabaseClient";

const tableName = 'contract'; // Nombre de la tabla en la base de datos
export const ContractController = {

    async createContract(req: Request, res: Response) {
        try {
            // Validar y transformar los datos de entrada
            validateContract(req.body);
            // Obtener el plan de pago
            const { data: paymentPlan, error: errorPorImei } = await supabase
                .from('payment_plan')
                .select('*')
                .eq('payment_plan_id', req.body.payment_plan_id)
                .single();

            if (!paymentPlan) {
                throw new Error('Payment plan not found'); // Lanzar error
            }

            // Preparar los datos del contrato
            // Crear una nueva instancia de Contract con todos los campos necesarios
            const contractData: Contract = new Contract();

            // Asignar los valores validados
            contractData.device_id = req.body.device_id;
            contractData.payment_plan_id = req.body.payment_plan_id;
            contractData.down_payment = req.body.down_payment;

            // Asignar los valores calculados
            contractData.status = 'ACTIVE';
            contractData.created_at = new Date();
            contractData.next_payment_date = calculateNextPaymentDate();
            contractData.next_payment_amount = paymentPlan.monthly_payment;
            contractData.payment_progress = paymentPlan.total_cost
                ? (req.body.down_payment / paymentPlan.total_cost) * 100
                : 0;

            // Crear el contrato usando BaseService
            const { userId } = req;
            const contract = await BaseService.create<Contract>(tableName, contractData, userId);

            res.status(201).json(contract);
        } catch (error: any) {
            console.error('Error creating contract:', error);
            res.status(400).json({
                message: error.message || 'Error creating contract',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    },
    async getAllContracts(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const contracts = await BaseService.getAll<Contract>(tableName, ['id', 'payment_plans(months,weekly_payment,monthly_payment,total_cost),payments(payment_date,amount)', 'down_payment', 'next_payment_date', 'next_payment_amount', 'payment_progress', 'status'], where);
            res.json(contracts);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
    async getContract(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const contract = await BaseService.getAll<Contract>(tableName, ['id', 'payment_plans(months,weekly_payment,monthly_payment,total_cost),payments(payment_date,amount)', 'down_payment', 'next_payment_date', 'next_payment_amount', 'payment_progress', 'status'], { id });
            res.json(contract);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
    async deleteContract(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;
            await BaseService.delete<Contract>(tableName, id, userId);
            res.json({ message: 'Store eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
}
