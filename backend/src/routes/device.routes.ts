import express from 'express';
import { DeviceController } from '../controllers/device.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();
// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });
// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, DeviceController.getAllDevices);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, DeviceController.createDevice);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, DeviceController.updateDevice);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, DeviceController.deleteDevice);

//Ruta para bloqueo y desbloqueo masivo
router.post('/process-masive',upload.single('file'),sessionAuth, DeviceController.processMasiveDevices);
router.post('/insert-masive',upload.single('file'),sessionAuth, DeviceController.insertMasiveDevices);
router.patch('/:id/block', DeviceController.blockDevices);


export default router;