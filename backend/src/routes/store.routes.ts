import express from 'express';
import { StoreController } from '../controllers/store.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', StoreController.getAllStores);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, StoreController.createStore);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, StoreController.updateStore);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, StoreController.deleteStore);


export default router;