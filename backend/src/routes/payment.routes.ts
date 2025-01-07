import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', PaymentController.getAllPayments);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, PaymentController.createPayment);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, PaymentController.updatePayment);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, PaymentController.deletePayment);


export default router;