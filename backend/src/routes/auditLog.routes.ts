import express from 'express';
import { AuditLogController } from '../controllers/auditLog.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', AuditLogController.getAllAuditLogs);



export default router;