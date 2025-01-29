import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { Contract } from "../models/contract.model";
import { validateContract } from "../requests/contract.request";
import { calculateNextPaymentDate } from "../services/contract.service";
import supabase from "../config/supabaseClient";

const tableName = 'contracts'; // Nombre de la tabla en la base de datos
export const ContractController = {

    async createContract(req: Request, res: Response) {
        try {
            // Obtener los datos directamente del cuerpo de la solicitud
            const {
                device_id,
                payment_plan_id,
                down_payment,
                next_payment_date,
                next_payment_amount,
                payment_progress,
                status,
                created_at,
                nombre_cliente
            } = req.body;



            // Crear el contrato en la base de datos
            const { data: contract, error } = await supabase
                .from('contracts')
                .insert({
                    device_id,
                    payment_plan_id,
                    down_payment,
                    next_payment_date,
                    next_payment_amount,
                    payment_progress,
                    status,
                    created_at,
                    nombre_cliente
                })
                .single();

            if (error) {
                throw new Error(error.message);
            }

            // Responder con el contrato creado
            console.log(contract);
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
            const where = { ...req.query } // Convert query parameters to filters

            const { data: contracts, error } = await supabase
                .from(tableName)
                .select(`
              id,
              payment_plans (
                months,
                weekly_payment,
                monthly_payment,
                total_cost
              ),
              payments (
                payment_date,
                amount
              ),
              down_payment,
              next_payment_date,
              next_payment_amount,
              payment_progress,
              status,
              nombre_cliente,
              devices (
                marca,
                modelo,
                price
              )
            `)
                .match(where)

            if (error) {
                throw new Error(error.message)
            }

            console.log(contracts)
            res.json(contracts)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
    async getContract(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const contract = await BaseService.getAll<Contract>(tableName, ['id', 'payment_plans(months,weekly_payment,monthly_payment,total_cost),payments(payment_date,amount)', 'down_payment', 'next_payment_date', 'next_payment_amount', 'payment_progress', 'status', 'nombre_cliente'], { id });
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
