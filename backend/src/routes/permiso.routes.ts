import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { PermisoController } from '../controllers/permisos.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: Gestión de permisos de usuarios
 */

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Crear una nueva categoría de permiso
 *     description: Crea una nueva categoría de permiso con los datos proporcionados.
 *     tags: [Permisos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría de permiso
 *                 example: "Admin"
 *     responses:
 *       201:
 *         description: Permiso creado correctamente
 *       400:
 *         description: Solicitud incorrecta, faltan datos requeridos o datos mal formateados
 *       401:
 *         description: No autorizado, no se incluye un token válido
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, PermisoController.store);

export default router;
