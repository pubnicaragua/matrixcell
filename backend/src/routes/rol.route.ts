import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { RolController } from '../controllers/roles.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles de usuario
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener todos los roles
 *     description: Obtiene una lista completa de todos los roles registrados en el sistema.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 *       401:
 *         description: No autorizado, el token de autenticación es incorrecto o falta.
 *     security:
 *       - Bearer: []
 */
router.get('/', sessionAuth, RolController.getAllRols);

/**
 * @swagger
 * /roles/assign:
 *   post:
 *     summary: Asignar un rol a un usuario
 *     description: Asigna un rol a un usuario específico basado en el `userId` y el `role` proporcionado.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario al que se asignará el rol.
 *               role:
 *                 type: string
 *                 description: Nombre del rol a asignar al usuario.
 *             required:
 *               - userId
 *               - role
 *     responses:
 *       200:
 *         description: Rol asignado correctamente al usuario.
 *       400:
 *         description: Solicitud incorrecta, los parámetros `userId` y `role` deben estar presentes y ser válidos.
 *       401:
 *         description: No autorizado, el token de autenticación es incorrecto o falta.
 *       404:
 *         description: Usuario o rol no encontrado.
 *     security:
 *       - Bearer: []
 */
router.post('/assign', sessionAuth, RolController.assign);

export default router;
