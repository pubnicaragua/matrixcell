import { TechnicalServiceController } from "../controllers/technicalService.controller";
import express from 'express';
import { sessionAuth } from "../middlewares/supabaseMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Servicio Técnico
 *   description: Gestión de servicios técnicos
 */

/**
 * @swagger
 * /technical-services:
 *   get:
 *     summary: Obtener todos los servicios técnicos
 *     description: Devuelve una lista de todos los servicios técnicos registrados.
 *     tags: [Servicio Técnico]
 *     responses:
 *       200:
 *         description: Lista de servicios técnicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del servicio técnico
 *                   client:
 *                     type: string
 *                     description: Nombre del cliente
 *                   service_type:
 *                     type: string
 *                     description: Tipo de servicio técnico
 *                   description:
 *                     type: string
 *                     description: Descripción del servicio técnico
 *                   status:
 *                     type: string
 *                     description: Estado del servicio técnico (Pendiente, Completado, etc.)
 *                   cost:
 *                     type: number
 *                     format: float
 *                     description: Costo del servicio técnico
 *                   store_id:
 *                     type: integer
 *                     description: ID de la tienda asociada
 *                   product_id:
 *                     type: integer
 *                     description: ID del producto asociado
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', sessionAuth, TechnicalServiceController.getAllTechnicalServices);

/**
 * @swagger
 * /technical-services:
 *   post:
 *     summary: Crear un nuevo servicio técnico
 *     description: Crea un nuevo registro de servicio técnico con los datos proporcionados.
 *     tags: [Servicio Técnico]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *                 description: Nombre del cliente
 *               service_type:
 *                 type: string
 *                 description: Tipo de servicio técnico
 *               description:
 *                 type: string
 *                 description: Descripción del servicio técnico
 *               status:
 *                 type: string
 *                 description: Estado del servicio técnico
 *               cost:
 *                 type: number
 *                 format: float
 *                 description: Costo del servicio técnico
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda asociada
 *               product_id:
 *                 type: integer
 *                 description: ID del producto asociado
 *     responses:
 *       201:
 *         description: Servicio técnico creado exitosamente
 *       400:
 *         description: Solicitud incorrecta, los datos proporcionados son inválidos
 *       401:
 *         description: No autorizado, el token de autenticación es incorrecto o falta
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.post('/', sessionAuth, TechnicalServiceController.createTechnicalService);

/**
 * @swagger
 * /technical-services/{id}:
 *   put:
 *     summary: Actualizar un servicio técnico existente
 *     description: Actualiza un servicio técnico según el ID proporcionado.
 *     tags: [Servicio Técnico]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del servicio técnico a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *                 description: Nombre del cliente
 *               service_type:
 *                 type: string
 *                 description: Tipo de servicio técnico
 *               description:
 *                 type: string
 *                 description: Descripción del servicio técnico
 *               status:
 *                 type: string
 *                 description: Estado del servicio técnico
 *               cost:
 *                 type: number
 *                 format: float
 *                 description: Costo del servicio técnico
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda asociada
 *               product_id:
 *                 type: integer
 *                 description: ID del producto asociado
 *     responses:
 *       200:
 *         description: Servicio técnico actualizado exitosamente
 *       400:
 *         description: Solicitud incorrecta, los datos proporcionados son inválidos
 *       401:
 *         description: No autorizado, el token de autenticación es incorrecto o falta
 *       404:
 *         description: Servicio técnico no encontrado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.put('/:id', sessionAuth, TechnicalServiceController.updateTechnicalService);

/**
 * @swagger
 * /technical-services/{id}:
 *   delete:
 *     summary: Eliminar un servicio técnico
 *     description: Elimina un servicio técnico existente según el ID proporcionado.
 *     tags: [Servicio Técnico]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del servicio técnico a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio técnico eliminado exitosamente
 *       401:
 *         description: No autorizado, el token de autenticación es incorrecto o falta
 *       404:
 *         description: Servicio técnico no encontrado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - Bearer: []
 */
router.delete('/:id', sessionAuth, TechnicalServiceController.deleteTechnicalService);

export default router;
