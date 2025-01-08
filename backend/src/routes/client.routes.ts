import express from 'express';
import { ClientController } from '../controllers/client.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();
// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });
// Ruta para obtener todos los clientes
router.get('/',sessionAuth, ClientController.getAllClients);

// Ruta para crear un nuevo cliente
router.post('/',sessionAuth, ClientController.createClient);


// Ruta para actualizar una cliente
router.put('/:id',sessionAuth, ClientController.updateClient);

// Ruta para eliminar un cliente
router.delete('/:id',sessionAuth, ClientController.deleteClient);

router.post('/insercion-consolidado',upload.single('file'),sessionAuth, ClientController.consolidadoEquifax);

export default router;