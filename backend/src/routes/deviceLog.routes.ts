import express from 'express';
import { DeviceLogController } from '../controllers/deviceLog.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Device Logs
 *   description: Gestión de registros de dispositivos
 */

/**
 * @swagger
 * /device-logs:
 *   get:
 *     summary: Obtener todos los registros de dispositivos
 *     tags: [Device Logs]
 *     description: Obtiene una lista completa de todos los registros de dispositivos, incluyendo detalles de acciones realizadas y usuarios involucrados.
 *     responses:
 *       200:
 *         description: Lista de registros de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceLog'
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, DeviceLogController.getAllDeviceLogs);

export default router;
