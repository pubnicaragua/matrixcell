import express from 'express';
import { OperationController } from '../controllers/operation.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las operaciones
router.get('/', OperationController.getAllOperations);

// Ruta para crear una nueva operacion
router.post('/',sessionAuth, OperationController.createOperation);

// Ruta para actualizar una operacion existente
router.put('/:id',sessionAuth, OperationController.updateOperation);

// Ruta para eliminar una operacion
router.delete('/:id',sessionAuth, OperationController.deleteOperation);


export default router;