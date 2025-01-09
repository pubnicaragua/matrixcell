import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { InventoryController } from '../controllers/inventario.controller';

const router = express.Router();

router.get('/', sessionAuth, InventoryController.getAllInventory);
router.post('/moved', sessionAuth, InventoryController.inventoryMoved);
router.post('/store-moved', sessionAuth, InventoryController.storeMoved); // Rutas específicas primero
router.put('/:id', sessionAuth, InventoryController.updateInventory); // Rutas generales después
router.delete('/:id', sessionAuth, InventoryController.deleteInventory);

export default router;
