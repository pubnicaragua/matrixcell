import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

import multer from 'multer';

const router = express.Router();
// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, ProductController.getAllProducts);

// Ruta para crear una nueva tienda
router.post('/masive-insert',upload.single('file'),sessionAuth, ProductController.masiveProductInventory);



export default router;