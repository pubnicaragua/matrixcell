import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Obtener todos los pagos
 *     description: Obtiene una lista completa de todos los pagos registrados.
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, PaymentController.getAllPayments);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Crear un nuevo pago
 *     description: Crea un nuevo pago con los datos proporcionados.
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operation_id
 *               - client_id
 *               - payment_date
 *               - amount_paid
 *               - payment_method
 *             properties:
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación del pago
 *               operation_id:
 *                 type: integer
 *                 description: ID de la operación asociada al pago
 *               client_id:
 *                 type: integer
 *                 description: ID del cliente que realiza el pago
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha en la que se realizó el pago
 *               amount_paid:
 *                 type: number
 *                 description: Monto pagado
 *               payment_method:
 *                 type: string
 *                 description: Método de pago utilizado
 *               receipt_number:
 *                 type: string
 *                 description: Número de recibo del pago
 *     responses:
 *       201:
 *         description: Pago creado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, PaymentController.createPayment);

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Actualizar un pago existente
 *     description: Actualiza los datos de un pago existente según el ID proporcionado.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del pago a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación del pago
 *               operation_id:
 *                 type: integer
 *                 description: ID de la operación asociada al pago
 *               client_id:
 *                 type: integer
 *                 description: ID del cliente que realiza el pago
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha en la que se realizó el pago
 *               amount_paid:
 *                 type: number
 *                 description: Monto pagado
 *               payment_method:
 *                 type: string
 *                 description: Método de pago utilizado
 *               receipt_number:
 *                 type: string
 *                 description: Número de recibo del pago
 *     responses:
 *       200:
 *         description: Pago actualizado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 *     security:
 *       - Bearer: []
 */
router.put('/:id', sessionAuth, PaymentController.updatePayment);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     description: Elimina un pago existente según el ID proporcionado.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del pago a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 *     security:
 *       - Bearer: []
 */
router.delete('/:id', sessionAuth, PaymentController.deletePayment);

export default router;
