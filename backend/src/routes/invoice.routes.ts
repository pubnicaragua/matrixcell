import express from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Obtener todas las facturas
 *     description: Recupera todas las facturas almacenadas en el sistema.
 *     tags:
 *       - Facturas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facturas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la factura
 *                   total:
 *                     type: number
 *                     format: float
 *                     description: Monto total de la factura
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de emisión de la factura
 *       401:
 *         description: No autorizado. Se requiere autenticación.
 *       500:
 *         description: Error en el servidor
 */
router.get('/', sessionAuth, InvoiceController.getAllInvoices);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Crear una nueva factura
 *     description: Permite crear una nueva factura con los detalles proporcionados.
 *     tags:
 *       - Facturas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 format: float
 *                 description: Monto total de la factura
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de emisión de la factura
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     descripcion:
 *                       type: string
 *                       description: Descripción del ítem
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del ítem
 *                     precio:
 *                       type: number
 *                       format: float
 *                       description: Precio unitario del ítem
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Factura creada exitosamente."
 *                 factura:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la factura
 *                     total:
 *                       type: number
 *                       format: float
 *                       description: Monto total de la factura
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de emisión de la factura
 *       400:
 *         description: Datos incorrectos proporcionados
 *       401:
 *         description: No autorizado. Se requiere autenticación.
 *       500:
 *         description: Error en el servidor
 */
router.post('/', sessionAuth, InvoiceController.createInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Actualizar una factura existente
 *     description: Permite actualizar una factura existente según el ID proporcionado.
 *     tags:
 *       - Facturas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la factura a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 format: float
 *                 description: Monto total de la factura
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de emisión de la factura
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Factura actualizada exitosamente."
 *                 factura:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la factura
 *                     total:
 *                       type: number
 *                       format: float
 *                       description: Monto total de la factura
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de emisión de la factura
 *       400:
 *         description: Datos incorrectos proporcionados
 *       401:
 *         description: No autorizado. Se requiere autenticación.
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', sessionAuth, InvoiceController.updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Eliminar una factura existente
 *     description: Permite eliminar una factura según el ID proporcionado.
 *     tags:
 *       - Facturas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la factura a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Factura eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Factura eliminada exitosamente."
 *       404:
 *         description: Factura no encontrada
 *       401:
 *         description: No autorizado. Se requiere autenticación.
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', sessionAuth, InvoiceController.deleteInvoice);

export default router;
