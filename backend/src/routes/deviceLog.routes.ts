import express from 'express';
import { DeviceLogController } from '../controllers/deviceLog.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, DeviceLogController.getAllDeviceLogs);



export default router;