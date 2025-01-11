import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { InventoryController } from '../controllers/inventario.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de inventario y movimientos
 */

/**
 * @swagger
 * /inventories:
 *   get:
 *     summary: Obtener todos los inventarios
 *     tags: [Inventario]
 *     description: Obtiene una lista completa de todos los productos en inventario.
 *     responses:
 *       200:
 *         description: Lista de inventarios
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, InventoryController.getAllInventory);

/**
 * @swagger
 * /inventories/moved:
 *   post:
 *     summary: Registrar movimiento de inventario
 *     tags: [Inventario]
 *     description: Registra el movimiento de inventario entre tiendas con detalles del producto y cantidad.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: integer
 *               inventario_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               tipo_movimiento:
 *                 type: string
 *                 description: El tipo de movimiento (ej. "entrada" o "salida")
 *               motivo:
 *                 type: string
 *               codigoProducto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimiento de inventario registrado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/moved', sessionAuth, InventoryController.inventoryMoved);

/**
 * @swagger
 * /inventories/store-moved:
 *   post:
 *     summary: Registrar movimiento de productos entre tiendas
 *     tags: [Inventario]
 *     description: Registra el movimiento de productos entre tiendas con detalles de cantidad y tiendas origen y destino.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               origen_store:
 *                 type: integer
 *               destino_store:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movimiento entre tiendas registrado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/store-moved', sessionAuth, InventoryController.storeMoved);

/**
 * @swagger
 * /inventories/{id}:
 *   put:
 *     summary: Actualizar inventario
 *     tags: [Inventario]
 *     description: Actualiza los datos de un producto en inventario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del inventario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               store_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventario actualizado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inventario no encontrado
 *     security:
 *       - Bearer: []
 */
router.put('/:id', sessionAuth, InventoryController.updateInventory);

/**
 * @swagger
 * /inventories/{id}:
 *   delete:
 *     summary: Eliminar inventario
 *     tags: [Inventario]
 *     description: Elimina un producto del inventario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del producto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inventario no encontrado
 *     security:
 *       - Bearer: []
 */
router.delete('/:id', sessionAuth, InventoryController.deleteInventory);

export default router;
