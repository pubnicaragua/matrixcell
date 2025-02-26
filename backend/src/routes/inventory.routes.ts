import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { InventoryController } from '../controllers/inventario.controller';

const router = express.Router();

router.get('/', sessionAuth, InventoryController.getAllInventory);

router.post('/moved', sessionAuth, InventoryController.inventoryMoved);

router.post('/store-moved', sessionAuth, InventoryController.storeMoved);

router.delete('/:id', sessionAuth, InventoryController.deleteInventory);

router.post('/', sessionAuth, InventoryController.createInventoryWithProduct);

router.put('/:id', sessionAuth, InventoryController.updateInventory);


export default router;
