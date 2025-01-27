import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { PaymentPlanController } from '../controllers/paymentPlan.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Planes de Pago
 *   description: Gestión de planes de pago
 */

/**
 * @swagger
 * /payment-plans:
 *   get:
 *     summary: Obtener todos los planes de pago
 *     description: Obtiene una lista completa de todos los planes de pago registrados.
 *     tags: [Planes de Pago]
 *     responses:
 *       200:
 *         description: Lista de planes de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     nullable: true
 *                     description: ID único del plan de pago
 *                   device_id:
 *                     type: integer
 *                     nullable: true
 *                     description: ID del dispositivo asociado al plan de pago
 *                   months:
 *                     type: integer
 *                     nullable: true
 *                     description: Número de meses del plan
 *                   weekly_payment:
 *                     type: number
 *                     nullable: true
 *                     description: Pago semanal
 *                   monthly_payment:
 *                     type: number
 *                     nullable: true
 *                     description: Pago mensual
 *                   total_cost:
 *                     type: number
 *                     nullable: true
 *                     description: Costo total del plan
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     description: Fecha de creación del plan
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, PaymentPlanController.getAllPaymentPlans);

/**
 * @swagger
 * /payment-plans:
 *   post:
 *     summary: Crear un nuevo plan de pago
 *     description: Crea un nuevo plan de pago con los datos proporcionados.
 *     tags: [Planes de Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - price
 *               - downPayment
 *             properties:
 *               device_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID del dispositivo asociado al plan de pago
 *               price:
 *                 type: number
 *                 nullable: true
 *                 description: Pago semanal
 *               downPayment:
 *                 type: number
 *                 nullable: true
 *                 description: Pago mensual
 *     responses:
 *       201:
 *         description: Plan de pago creado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, PaymentPlanController.createPaymentPlan);

/**
 * @swagger
 * /payment-plans/{id}:
 *   put:
 *     summary: Actualizar un plan de pago existente
 *     description: Actualiza los datos de un plan de pago existente según el ID proporcionado.
 *     tags: [Planes de Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del plan de pago a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID del dispositivo asociado al plan de pago
 *               months:
 *                 type: integer
 *                 nullable: true
 *                 description: Número de meses del plan
 *               weekly_payment:
 *                 type: number
 *                 nullable: true
 *                 description: Pago semanal
 *               monthly_payment:
 *                 type: number
 *                 nullable: true
 *                 description: Pago mensual
 *               total_cost:
 *                 type: number
 *                 nullable: true
 *                 description: Costo total del plan
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Fecha de creación del plan
 *     responses:
 *       200:
 *         description: Plan de pago actualizado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Plan de pago no encontrado
 *     security:
 *       - Bearer: []
 */
router.put('/:id', sessionAuth, PaymentPlanController.updatePaymentPlan);

/**
 * @swagger
 * /payment-plans/{id}:
 *   delete:
 *     summary: Eliminar un plan de pago
 *     description: Elimina un plan de pago existente según el ID proporcionado.
 *     tags: [Planes de Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del plan de pago a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan de pago eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Plan de pago no encontrado
 *     security:
 *       - Bearer: []
 */
router.delete('/:id', sessionAuth, PaymentPlanController.deletePaymentPlan);

export default router;
