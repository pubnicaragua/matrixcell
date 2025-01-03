import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { RolController } from '../controllers/roles.controller';

const router = express.Router();

// Ruta para obtener todas las categorías
router.get('/', sessionAuth,RolController.getAllRols);
router.post('/assign',sessionAuth, RolController.assign);


export default router;
