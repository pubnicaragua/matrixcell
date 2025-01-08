import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';

import multer from 'multer';
import { InventoryController } from '../controllers/inventario.controller';

const router = express.Router();





router.post('/moved',sessionAuth, InventoryController.inventoryMoved);
router.post('/store-moved',sessionAuth, InventoryController.storeMoved);



export default router;