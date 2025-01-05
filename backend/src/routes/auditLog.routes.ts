import express from 'express';
import { AuditLogController } from '../controllers/auditLog.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, AuditLogController.getAllAuditLogs);



export default router;