import express from 'express';
import { StoreController } from '../controllers/store.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', StoreController.getAllStores);

// Ruta para crear una nueva tienda
router.post('/', StoreController.createStore);

// Ruta para actualizar una tienda existente
router.put('/:id', StoreController.updateStore);

// Ruta para eliminar una tienda
router.delete('/:id', StoreController.deleteStore);


export default router;