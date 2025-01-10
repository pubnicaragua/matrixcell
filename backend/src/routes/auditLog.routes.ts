import express from 'express';
import { AuditLogController } from '../controllers/auditLog.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Gestión de registros de auditoría
 */
/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Obtener todos los registros de auditoría
 *     tags: [Audit Logs]
 *     description: Obtiene una lista completa de todos los registros de auditoría con detalles del evento, usuario asociado y otros datos relevantes.
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: No autorizado
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, AuditLogController.getAllAuditLogs);

export default router;
