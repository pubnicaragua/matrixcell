import express from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, InvoiceController.getAllInvoices);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, InvoiceController.createInvoice);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, InvoiceController.updateInvoice);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, InvoiceController.deleteInvoice);


export default router;