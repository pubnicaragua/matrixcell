import express from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware'; // El middleware para verificar la sesión

const router = express.Router();

// Ruta para obtener todos los usuarios (con sus datos de perfil, roles y permisos)
router.get('/', sessionAuth, UsuarioController.getAuthenticatedUser);

export default router;