import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión del usuario
 *     description: Autentica al usuario y devuelve un token con los permisos correspondientes. El token recibido debe ser enviado en el encabezado `Authorization` como un Bearer Token en futuras solicitudes protegidas.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Dirección de correo electrónico del usuario
 *                 example: "example@email.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "exp12345"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inicio de sesión exitoso"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a951667d-425a-4506-8f5c-f4e383912721"
 *                     aud:
 *                       type: string
 *                       example: "authenticated"
 *                     role:
 *                       type: string
 *                       example: "authenticated"
 *                     email:
 *                       type: string
 *                       example: "example@email.com"
 *                     email_confirmed_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-03T13:51:55.039968Z"
 *                     phone:
 *                       type: string
 *                       example: ""
 *                     last_sign_in_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-10T01:42:40.577816431Z"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Benjamin"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-06T01:52:38.539902+00:00"
 *                     roles:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Admin"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Ver dashboard", "Editar usuarios", "Crear reportes", "Manejar servicios técnicos"]
 *                 token:
 *                   type: string
 *                   description: "El token de acceso generado para el usuario. Este token debe ser enviado como un Bearer Token en el encabezado `Authorization` de futuras solicitudes a los endpoints protegidos de la API."
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciales inválidas (el correo electrónico o la contraseña son incorrectos)
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     description: Invalida la sesión del usuario y cierra la sesión.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión cerrada exitosamente."
 *       500:
 *         description: Error en el servidor
 */
router.post("/logout", sessionAuth, AuthController.logut);

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Actualizar contraseña
 *     description: Permite actualizar la contraseña del usuario autenticado.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña para el usuario
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       500:
 *         description: Error en el servidor
 */
router.post("/update-password", AuthController.updatePassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar contraseña del usuario
 *     description: Cambia la contraseña del usuario autenticado mediante verificación de token.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de verificación del usuario
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña para el usuario
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña cambiada exitosamente."
 *       500:
 *         description: Error en el servidor
 */
router.post("/change-password", AuthController.changePassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     description: Envía un correo electrónico con el enlace para restablecer la contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario para el restablecimiento de contraseña
 *                 example: "example@email.com"
 *     responses:
 *       200:
 *         description: Correo de restablecimiento enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Check your email for the reset link."
 *       500:
 *         description: Error en el servidor
 */
router.post('/reset-password', AuthController.resetPassword);

export default router;
