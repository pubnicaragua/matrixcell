import express from 'express';
import { DeviceLogController } from '../controllers/deviceLog.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', DeviceLogController.getAllDeviceLogs);



export default router;