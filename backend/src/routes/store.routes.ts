import express from 'express';
import { StoreController } from '../controllers/store.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tiendas
 *   description: API para la gestión de tiendas y sucursales
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Listar todas las tiendas
 *     tags: [Tiendas]
 *     description: Obtiene un listado completo de todas las tiendas registradas en el sistema.
 *     responses:
 *       200:
 *         description: Listado de tiendas recuperado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al recuperar las tiendas"
 */
router.get('/', StoreController.getAllStores);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Crear una nueva tienda
 *     tags: [Tiendas]
 *     security:
 *       - Bearer: []
 *     description: Crea un nuevo registro de tienda con la información proporcionada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Tienda creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de entrada inválidos"
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', sessionAuth, StoreController.createStore);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Actualizar una tienda existente
 *     tags: [Tiendas]
 *     security:
 *       - Bearer: []
 *     description: Actualiza la información de una tienda existente según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Tienda actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', sessionAuth, StoreController.updateStore);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Eliminar una tienda
 *     tags: [Tiendas]
 *     security:
 *       - Bearer: []
 *     description: Elimina una tienda existente del sistema según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda a eliminar
 *     responses:
 *       200:
 *         description: Tienda eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tienda eliminada correctamente"
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       404:
 *         description: Tienda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', sessionAuth, StoreController.deleteStore);

export default router;