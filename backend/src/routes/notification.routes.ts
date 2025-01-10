import express from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notificaciones
 *     description: Gestión de notificaciones
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Notificaciones
 *     summary: Obtener todas las notificaciones
 *     description: Obtiene una lista completa de todas las notificaciones.
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la notificación
 *                   message:
 *                     type: string
 *                     description: Mensaje de la notificación
 *                   status:
 *                     type: string
 *                     description: Estado de la notificación
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, NotificationController.getAllNotifications);

/**
 * @swagger
 * /notifications:
 *   post:
 *     tags:
 *       - Notificaciones
 *     summary: Crear una nueva notificación
 *     description: Crea una nueva notificación con los datos proporcionados.
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
 *                 description: Fecha de creación de la notificación
 *               message:
 *                 type: string
 *                 description: El mensaje de la notificación
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario al que pertenece la notificación
 *               invoice_id:
 *                 type: integer
 *                 description: ID de la factura asociada a la notificación
 *               status:
 *                 type: string
 *                 description: Estado de la notificación (ej. 'pendiente', 'leída')
 *     responses:
 *       201:
 *         description: Notificación creada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, NotificationController.createNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     tags:
 *       - Notificaciones
 *     summary: Actualizar una notificación existente
 *     description: Actualiza los datos de una notificación existente según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID de la notificación a actualizar
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
 *                 description: Fecha de creación de la notificación
 *               message:
 *                 type: string
 *                 description: El mensaje de la notificación
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario al que pertenece la notificación
 *               invoice_id:
 *                 type: integer
 *                 description: ID de la factura asociada a la notificación
 *               status:
 *                 type: string
 *                 description: Estado de la notificación (ej. 'pendiente', 'leída')
 *     responses:
 *       200:
 *         description: Notificación actualizada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Notificación no encontrada
 *     security:
 *       - Bearer: []
 */
router.put('/:id', sessionAuth, NotificationController.updateNotification);

export default router;
