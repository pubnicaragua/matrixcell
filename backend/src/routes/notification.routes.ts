import express from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', NotificationController.getAllNotifications);

// Ruta para crear una nueva tienda
router.post('/', NotificationController.createNotification);

// Ruta para actualizar una tienda existente
router.put('/:id', NotificationController.updateNotification);




export default router;