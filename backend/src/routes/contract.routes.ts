import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { ContractController } from '../controllers/contract.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contratos Firmados
 *   description: Gestión de contratos firmados
 */

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Obtener todos los contratos
 *     description: Recupera una lista completa de todos los contratos registrados.
 *     tags: [Contratos Firmados]
 *     responses:
 *       200:
 *         description: Lista de contratos firmados
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
 *                   device_id:
 *                     type: integer
 *                     nullable: true
 *                   payment_plan_id:
 *                     type: integer
 *                     nullable: true
 *                   down_payment:
 *                     type: number
 *                     nullable: true
 *                   next_payment_date:
 *                     type: integer
 *                     nullable: true
 *                   next_payment_amount:
 *                     type: number
 *                     nullable: true
 *                   payment_progress:
 *                     type: number
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     nullable: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, ContractController.getAllContracts);

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Obtener un contrato por ID
 *     description: Recupera un contrato específico según el ID proporcionado.
 *     tags: [Contratos Firmados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contrato
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contrato encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   nullable: true
 *                 device_id:
 *                   type: integer
 *                   nullable: true
 *                 payment_plan_id:
 *                   type: integer
 *                   nullable: true
 *                 down_payment:
 *                   type: number
 *                   nullable: true
 *                 next_payment_date:
 *                   type: integer
 *                   nullable: true
 *                 next_payment_amount:
 *                   type: number
 *                   nullable: true
 *                 payment_progress:
 *                   type: number
 *                   nullable: true
 *                 status:
 *                   type: string
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.get('/:id', sessionAuth, ContractController.getContract);

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Crear un nuevo contrato
 *     description: Crea un nuevo contrato con los datos proporcionados.
 *     tags: [Contratos Firmados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - payment_plan_id
 *               - downPayment
 *             properties:
 *               device_id:
 *                 type: integer
 *                 description: ID del dispositivo asociado al contrato
 *               payment_plan_id:
 *                 type: integer
 *                 description: ID del plan de pago
 *               downPayment:
 *                 type: number
 *                 description: Monto de pago inicial
 *     responses:
 *       201:
 *         description: Contrato creado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, ContractController.createContract);

/**
 * @swagger
 * /contracts/{id}:
 *   delete:
 *     summary: Eliminar un contrato
 *     description: Elimina un contrato existente según el ID proporcionado.
 *     tags: [Contratos Firmados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contrato a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contrato eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.delete('/:id', sessionAuth, ContractController.deleteContract);

export default router;
