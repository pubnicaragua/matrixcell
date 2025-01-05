import express from 'express';
import { DeviceController } from '../controllers/device.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, DeviceController.getAllDevices);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, DeviceController.createDevice);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, DeviceController.updateDevice);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, DeviceController.deleteDevice);


export default router;