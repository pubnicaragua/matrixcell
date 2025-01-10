import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();
// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Obtiene una lista completa de todos los productos registrados.
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: No autorizado, no se incluye un token válido
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, ProductController.getAllProducts);

/**
 * @swagger
 * /products/masive-insert:
 *   post:
 *     summary: Insertar productos masivamente
 *     description: Permite realizar una inserción masiva de productos a través de un archivo CSV o Excel.
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV o Excel con los productos a insertar masivamente.
 *     responses:
 *       201:
 *         description: Productos insertados correctamente
 *       400:
 *         description: Solicitud incorrecta, archivo malformado o error en los datos
 *       401:
 *         description: No autorizado, no se incluye un token válido
 *     security:
 *       - Bearer: []
 */
router.post('/masive-insert', upload.single('file'), sessionAuth, ProductController.masiveProductInventory);

export default router;
