import express from 'express';
import { StatusController } from '../controllers/status.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', StatusController.getAllStatuss);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, StatusController.createStatus);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, StatusController.updateStatus);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, StatusController.deleteStatus);


export default router;