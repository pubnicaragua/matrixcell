import express from 'express';
import { DeviceController } from '../controllers/device.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import multer from 'multer';

const router = express.Router();

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usar almacenamiento en memoria
const upload = multer({ storage });

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Obtener todos los dispositivos
 *     description: Obtiene todos los dispositivos registrados.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   imei:
 *                     type: string
 *                   status:
 *                     type: string
 *                   owner:
 *                     type: integer
 *                   store_id:
 *                     type: integer
 *                   cliente:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', sessionAuth, DeviceController.getAllDevices);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Crear un dispositivo
 *     description: Crea un nuevo dispositivo en la base de datos.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imei:
 *                 type: string
 *                 description: IMEI del dispositivo
 *                 example: "123456789012345"
 *               status:
 *                 type: string
 *                 description: Estado del dispositivo (Unlocked/Blocked)
 *                 example: "Unlocked"
 *               owner:
 *                 type: integer
 *                 description: ID del propietario del dispositivo
 *                 example: 1
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda donde se encuentra el dispositivo
 *                 example: 101
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente asociado al dispositivo
 *                 example: "Juan Perez"
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación del dispositivo
 *                 example: "2025-01-09T12:00:00Z"
 *     responses:
 *       201:
 *         description: Dispositivo creado correctamente.
 *       400:
 *         description: Error de validación o entrada incorrecta.
 *       500:
 *         description: Error al crear el dispositivo.
 */
router.post('/', sessionAuth, DeviceController.createDevice);

/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Actualizar un dispositivo
 *     description: Actualiza un dispositivo específico según el ID proporcionado.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del dispositivo a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imei:
 *                 type: string
 *                 description: IMEI del dispositivo
 *                 example: "123456789012345"
 *               status:
 *                 type: string
 *                 description: Estado del dispositivo (Unlocked/Blocked)
 *                 example: "Unlocked"
 *               owner:
 *                 type: integer
 *                 description: ID del propietario del dispositivo
 *                 example: 1
 *               store_id:
 *                 type: integer
 *                 description: ID de la tienda donde se encuentra el dispositivo
 *                 example: 101
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente asociado al dispositivo
 *                 example: "Juan Perez"
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación del dispositivo
 *                 example: "2025-01-09T12:00:00Z"
 *     responses:
 *       200:
 *         description: Dispositivo actualizado correctamente.
 *       400:
 *         description: Error de validación o datos incorrectos.
 *       404:
 *         description: Dispositivo no encontrado.
 */
router.put('/:id', sessionAuth, DeviceController.updateDevice);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Eliminar un dispositivo
 *     description: Elimina un dispositivo específico de la base de datos.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del dispositivo a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dispositivo eliminado correctamente.
 *       400:
 *         description: Error al eliminar el dispositivo.
 *       404:
 *         description: Dispositivo no encontrado.
 */
router.delete('/:id', sessionAuth, DeviceController.deleteDevice);

/**
 * @swagger
 * /devices/process-masive:
 *   post:
 *     summary: Procesar bloqueo/desbloqueo masivo
 *     description: Procesa un archivo Excel con acciones de bloqueo/desbloqueo para varios dispositivos.
 *     tags:
 *       - Dispositivos
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
 *     responses:
 *       200:
 *         description: Procesamiento completo de bloqueo/desbloqueo.
 *       400:
 *         description: Error con el archivo o los datos procesados.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/process-masive', upload.single('file'), sessionAuth, DeviceController.processMasiveDevices);

/**
 * @swagger
 * /devices/insert-masive:
 *   post:
 *     summary: Insertar dispositivos masivos
 *     description: Inserta dispositivos masivos desde un archivo Excel con datos de clientes y dispositivos.
 *     tags:
 *       - Dispositivos
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
 *     responses:
 *       200:
 *         description: Dispositivos insertados exitosamente.
 *       400:
 *         description: Error con el archivo o los datos procesados.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/insert-masive', upload.single('file'), sessionAuth, DeviceController.insertMasiveDevices);

/**
 * @swagger
 * /devices/{id}/block:
 *   patch:
 *     summary: Bloquear dispositivo
 *     description: Bloquea un dispositivo específico.
 *     tags:
 *       - Dispositivos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del dispositivo a bloquear.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dispositivo bloqueado correctamente.
 *       400:
 *         description: Error al bloquear el dispositivo.
 */
router.patch('/:id/block', DeviceController.blockDevices);

/**
 * @swagger
 * /devices/{id}/unlock:
 *   patch:
 *     summary: Desbloquear dispositivo
 *     description: Desbloquea un dispositivo específico con un código de desbloqueo.
 *     tags:
 *       - Dispositivos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del dispositivo a desbloquear.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: unlockCode
 *         required: true
 *         description: Código de desbloqueo para el dispositivo.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo desbloqueado correctamente.
 *       400:
 *         description: Error al desbloquear el dispositivo o falta del código de desbloqueo.
 */
router.patch('/:id/unlock', DeviceController.unlockDevices);
/**
 * @swagger
 * /unlock-request:
 *   post:
 *     summary: Solicitar desbloqueo de un dispositivo
 *     description: Procesa una solicitud de desbloqueo de un dispositivo basado en los datos proporcionados.
 *     tags: [Desbloquear Dispositivo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_id_sujeto:
 *                 type: string
 *                 description: Identificador del cliente en el sistema.
 *                 example: "12345678"
 *               voucher_pago:
 *                 type: string
 *                 description: Comprobante de pago para la solicitud de desbloqueo.
 *                 example: "VCHR12345"
 *               imei:
 *                 type: string
 *                 description: IMEI del dispositivo que se desea desbloquear.
 *                 example: "123456789012345"
 *               ip:
 *                 type: string
 *                 description: Dirección IP desde donde se realiza la solicitud.
 *                 example: "192.168.0.1"
 *     responses:
 *       200:
 *         description: Solicitud procesada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Solicitud recibida. Nos comunicaremos pronto."
 *                 unlock_code:
 *                   type: string
 *                   description: Código de desbloqueo generado (opcional).
 *                   example: "UNLOCK12345"
 *       400:
 *         description: Solicitud incorrecta.
 *       404:
 *         description: Cliente o dispositivo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/unlock-request', DeviceController.unlockRequest);

/**
 * @swagger
 * /unlock-validate:
 *   post:
 *     summary: Validar código o IMEI para desbloqueo
 *     description: Valida si un código de desbloqueo o IMEI es correcto.
 *     tags: [Desbloquear Dispositivo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código de desbloqueo del dispositivo.
 *                 example: "ABC12345"
 *               imei:
 *                 type: string
 *                 description: IMEI del dispositivo.
 *                 example: "123456789012345"
 *     responses:
 *       200:
 *         description: Validación exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "El código o IMEI son válidos"
 *                 next_due_date:
 *                   type: string
 *                   format: date
 *                   description: Fecha de vencimiento de la próxima operación (si aplica).
 *                   example: "2025-01-15"
 *       400:
 *         description: Parámetros obligatorios faltantes o incorrectos.
 *       404:
 *         description: Código o IMEI incorrectos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/unlock-validate', DeviceController.unlockValidate);
/**
 * @swagger
 * /validate-code:
 *   post:
 *     tags:
 *       - [Desbloquear Dispositivo]
 *     summary: Validar código de desbloqueo
 *     description: Permite validar un código de desbloqueo o IMEI y desbloquear un dispositivo si la información es válida.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código de desbloqueo del dispositivo.
 *                 example: "123456"
 *               imei:
 *                 type: string
 *                 description: IMEI del dispositivo.
 *                 example: "123456789012345"
 *     responses:
 *       200:
 *         description: Dispositivo desbloqueado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Desbloqueado"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clients:
 *                         type: object
 *                         properties:
 *                           identity_number:
 *                             type: string
 *                             example: "987654321"
 *                       operations:
 *                         type: object
 *                         properties:
 *                           prox_due_date:
 *                             type: string
 *                             example: "2025-01-14"
 *       400:
 *         description: Solicitud inválida. Algún campo obligatorio falta o está mal formado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Descripción del error."
 *       404:
 *         description: Código o IMEI incorrecto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Descripción del error."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Descripción del error."
 */
router.post('/validate-code', DeviceController.validateCode);

export default router;
