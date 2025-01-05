import express from 'express';
import { ClientController } from '../controllers/client.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las clientes
router.get('/',sessionAuth, ClientController.getAllClients);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, ClientController.createClient);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, ClientController.updateClient);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, ClientController.deleteClient);


export default router;