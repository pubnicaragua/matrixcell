import express from 'express';
import { ClientController } from '../controllers/client.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();
// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });
// Ruta para obtener todas las clientes
router.get('/',sessionAuth, ClientController.getAllClients);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, ClientController.createClient);
router.post('/insercion-consolidado',upload.single('file'),sessionAuth, ClientController.consolidadoEquifax);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, ClientController.updateClient);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, ClientController.deleteClient);


export default router;