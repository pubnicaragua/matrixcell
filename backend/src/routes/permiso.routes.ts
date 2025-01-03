import express from 'express';
import { sessionAuth } from '../middlewares/supabaseMidleware';
import { PermisoController } from '../controllers/permisos.controller';

const router = express.Router();

// Ruta para crear una nueva categoría
router.post('/',sessionAuth, PermisoController.store);


export default router;
