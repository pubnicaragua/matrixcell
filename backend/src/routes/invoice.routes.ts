import express from 'express';
import { InvoiceController } from '../controllers/invoice.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', InvoiceController.getAllInvoices);

// Ruta para crear una nueva tienda
router.post('/', InvoiceController.createInvoice);

// Ruta para actualizar una tienda existente
router.put('/:id', InvoiceController.updateInvoice);

// Ruta para eliminar una tienda
router.delete('/:id', InvoiceController.deleteInvoice);


export default router;