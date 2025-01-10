import express from 'express';
import { ClientController } from '../controllers/client.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });

// **Documentación Swagger para las rutas de clientes**

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Obtiene todos los clientes registrados.
 *     tags:
 *       - Clientes
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   identity_number:
 *                     type: string
 *                   identity_type:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   city:
 *                     type: string
 *                   due_date:
 *                     type: string
 *                     format: date-time
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   grant_date:
 *                     type: string
 *                     format: date-time
 *                   debt_type:
 *                     type: string
 *                   deadline:
 *                     type: integer
 */
router.get('/', sessionAuth, ClientController.getAllClients);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente en la base de datos.
 *     tags:
 *       - Clientes
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identity_number:
 *                 type: string
 *                 description: Número de identidad del cliente
 *                 example: "12345678901"
 *               identity_type:
 *                 type: string
 *                 description: Tipo de documento de identidad del cliente
 *                 example: "DNI"
 *               name:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Juan Pérez"
 *               address:
 *                 type: string
 *                 description: Dirección del cliente
 *                 example: "Calle Falsa 123"
 *               phone:
 *                 type: string
 *                 description: Teléfono del cliente
 *                 example: "+34123456789"
 *               city:
 *                 type: string
 *                 description: Ciudad del cliente
 *                 example: "Madrid"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de vencimiento del cliente
 *                 example: "2025-12-31T23:59:59Z"
 *               grant_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de otorgamiento
 *                 example: "2025-01-09T12:00:00Z"
 *               debt_type:
 *                 type: string
 *                 description: Tipo de deuda del cliente
 *                 example: "Hipotecaria"
 *               deadline:
 *                 type: integer
 *                 description: Plazo del cliente en días
 *                 example: 360
 *     responses:
 *       201:
 *         description: Cliente creado correctamente.
 *       400:
 *         description: Error de validación o entrada incorrecta.
 *       500:
 *         description: Error al crear el cliente.
 */
router.post('/', sessionAuth, ClientController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     description: Actualiza un cliente específico según el ID proporcionado.
 *     tags:
 *       - Clientes
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identity_number:
 *                 type: string
 *                 description: Número de identidad del cliente
 *                 example: "12345678901"
 *               identity_type:
 *                 type: string
 *                 description: Tipo de documento de identidad del cliente
 *                 example: "DNI"
 *               name:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Juan Pérez"
 *               address:
 *                 type: string
 *                 description: Dirección del cliente
 *                 example: "Calle Falsa 123"
 *               phone:
 *                 type: string
 *                 description: Teléfono del cliente
 *                 example: "+34123456789"
 *               city:
 *                 type: string
 *                 description: Ciudad del cliente
 *                 example: "Madrid"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de vencimiento del cliente
 *                 example: "2025-12-31T23:59:59Z"
 *               grant_date:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de otorgamiento
 *                 example: "2025-01-09T12:00:00Z"
 *               debt_type:
 *                 type: string
 *                 description: Tipo de deuda del cliente
 *                 example: "Hipotecaria"
 *               deadline:
 *                 type: integer
 *                 description: Plazo del cliente en días
 *                 example: 360
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       400:
 *         description: Error de validación o datos incorrectos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.put('/:id', sessionAuth, ClientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente específico de la base de datos.
 *     tags:
 *       - Clientes
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente.
 *       400:
 *         description: Error al eliminar el cliente.
 *       404:
 *         description: Cliente no encontrado.
 */
router.delete('/:id', sessionAuth, ClientController.deleteClient);

/**
 * @swagger
 * /clients/insercion-consolidado:
 *   post:
 *     summary: Insertar datos consolidados
 *     description: Procesa un archivo Excel para la inserción de datos consolidados.
 *     tags:
 *       - Clientes
 *     security:
 *       - sessionAuth: []
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
 *                 description: Archivo Excel con datos consolidados.
 *     responses:
 *       200:
 *         description: Datos consolidados insertados correctamente.
 *       400:
 *         description: Error con el archivo o los datos procesados.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/insercion-consolidado', upload.single('file'), sessionAuth, ClientController.consolidadoEquifax);

export default router;
