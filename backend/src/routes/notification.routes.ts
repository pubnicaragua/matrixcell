import express from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, NotificationController.getAllNotifications);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, NotificationController.createNotification);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, NotificationController.updateNotification);




export default router;