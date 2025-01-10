import express from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios con perfiles y permisos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del usuario autenticado.
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del usuario.
 *                   perfil:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre del usuario.
 *                       rol_id:
 *                         type: integer
 *                         description: ID del rol del usuario.
 *                       roles:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Nombre del rol.
 *                       permisos:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: Lista de permisos asociados al rol.
 */
router.get('/', sessionAuth, UsuarioController.getAllUsuarios);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: contraseñaSegura
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Juan Pérez
 *               rol_id:
 *                 type: integer
 *                 description: ID del rol asignado al usuario.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Error en la creación del usuario.
 */
router.post('/', sessionAuth, UsuarioController.createUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Nuevo correo electrónico del usuario.
 *                 example: nuevoEmail@example.com
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *                 example: Juan Actualizado
 *               rol_id:
 *                 type: integer
 *                 description: Nuevo rol asignado al usuario.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       400:
 *         description: Error al actualizar el usuario.
 */
router.put('/:id', sessionAuth, UsuarioController.updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       400:
 *         description: Error al eliminar el usuario.
 */
router.delete('/:id', sessionAuth, UsuarioController.deleteUsuario);

export default router;
