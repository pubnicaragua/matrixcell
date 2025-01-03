import express from 'express';
import { DeviceController } from '../controllers/device.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', DeviceController.getAllDevices);

// Ruta para crear una nueva tienda
router.post('/', DeviceController.createDevice);

// Ruta para actualizar una tienda existente
router.put('/:id', DeviceController.updateDevice);

// Ruta para eliminar una tienda
router.delete('/:id', DeviceController.deleteDevice);


export default router;