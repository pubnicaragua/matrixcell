import express from 'express';
import { OperationController } from '../controllers/operation.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Operaciones
 *   description: API para la gestión de operaciones financieras de clientes
 */

/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Listar todas las operaciones
 *     tags: [Operaciones]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de operaciones recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operation'
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.get('/', sessionAuth, OperationController.getAllOperations);

/**
 * @swagger
 * /operations:
 *   post:
 *     summary: Crear una nueva operación
 *     tags: [Operaciones]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       201:
 *         description: Operación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/', sessionAuth, OperationController.createOperation);

/**
 * @swagger
 * /operations/{id}:
 *   put:
 *     summary: Actualizar una operación existente
 *     tags: [Operaciones]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la operación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       200:
 *         description: Operación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operation'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       404:
 *         description: Operación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', sessionAuth, OperationController.updateOperation);

/**
 * @swagger
 * /operations/{id}:
 *   delete:
 *     summary: Eliminar una operación
 *     tags: [Operaciones]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la operación a eliminar
 *     responses:
 *       200:
 *         description: Operación eliminada exitosamente
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       404:
 *         description: Operación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', sessionAuth, OperationController.deleteOperation);

export default router;