import express from 'express';
import { OperationController } from '../controllers/operation.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', OperationController.getAllOperations);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, OperationController.createOperation);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, OperationController.updateOperation);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, OperationController.deleteOperation);


export default router;