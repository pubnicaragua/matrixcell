import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos realizados
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
 *                     description: ID único del pago
 *                   contract_id:
 *                     type: integer
 *                     nullable: true
 *                     description: ID del contrato asociado al pago
 *                   payment_date:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     description: Fecha en que se realizó el pago
 *                   amount:
 *                     type: number
 *                     nullable: true
 *                     description: Monto pagado
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     description: Fecha de creación del registro
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
 *               - contract_id
 *               - amount
 *             properties:
 *               contract_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID del contrato asociado al pago
 *               amount:
 *                 type: number
 *                 nullable: true
 *                 description: Monto pagado
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
 *               contract_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID del contrato asociado al pago
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Fecha en que se realizó el pago
 *               amount:
 *                 type: number
 *                 nullable: true
 *                 description: Monto pagado
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Fecha de creación del registro
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
