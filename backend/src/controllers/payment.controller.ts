import type { Request, Response } from "express"
import type { Payment } from "../models/payment.model"
import { validatePayment } from "../requests/payment.request"
import { BaseService } from "../services/base.service"
import { PaymentResource } from "../resources/payment.resource"
import supabase from "../config/supabaseClient"

const tableName = "payments" // Nombre de la tabla en la base de datos
export const PaymentController = {
    async getAllPayments(req: Request, res: Response) {
        try {
            const where = { ...req.query } // Convertir los parámetros de consulta en filtros
            const payments = await BaseService.getAll<Payment>(
                tableName,
                [
                    "id",
                    "created_at",
                    "operation_id",
                    "client_id",
                    "payment_date",
                    "amount_paid",
                    "receipt_number",
                    "contract_id",
                    "amount",
                ],
                where,
            )
            res.json(PaymentResource.formatPayments(payments))
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    async createPayment(req: Request, res: Response): Promise<void> {
        try {
            const { amount_paid, amount, receipt_number, operation_id, client_id } = req.body

            // Validar que todos los campos requeridos estén presentes
            if (!amount_paid || !amount || !receipt_number || !operation_id || !client_id) {
                res.status(400).json({ message: "Todos los campos son obligatorios." })
                return
            }

            // Validar que los valores numéricos sean positivos
            if (amount_paid <= 0 || amount <= 0) {
                res.status(400).json({ message: "Los montos deben ser mayores a 0." })
                return
            }

            // Verificar que el cliente existe
            const { data: clientExists, error: clientError } = await supabase
                .from("clients")
                .select("id")
                .eq("id", client_id)
                .single()

            if (clientError || !clientExists) {
                res.status(400).json({ message: "El cliente especificado no existe." })
                return
            }

            // Verificar que la operación existe
            const { data: operationExists, error: operationError } = await supabase
                .from("operations")
                .select("id")
                .eq("id", operation_id)
                .single()

            if (operationError || !operationExists) {
                res.status(400).json({ message: "La operación especificada no existe." })
                return
            }

            const { data, error } = await supabase
                .from("payments")
                .insert([
                    {
                        amount_paid,
                        amount,
                        receipt_number,
                        operation_id,
                        client_id,
                        payment_date: new Date().toISOString().split("T")[0],
                    },
                ])
                .select()

            if (error) {
                console.error("Error de Supabase:", error)
                throw error
            }

            res.status(201).json(data)
            console.log("Pago creado correctamente:", data)
        } catch (error: any) {
            console.error("Error creando pago:", error)
            console.error("Body:", req.body)
            res.status(500).json({
                message: "Error al registrar el pago.",
                error: error.message,
            })
        }
    },

    async updatePayment(req: Request, res: Response) {
        try {
            const { id } = req.params
            validatePayment(req.body) // Validar los datos
            const { userId } = req
            const payment = await BaseService.update<Payment>(tableName, Number.parseInt(id), req.body, userId)
            res.json(PaymentResource.formatPayment(payment))
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    async deletePayment(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { userId } = req

            await BaseService.delete<Payment>(tableName, id, userId)
            res.json({ message: "Payment eliminada correctamente" })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}

