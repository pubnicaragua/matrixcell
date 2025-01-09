import express from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// // Ruta para obtener todas las categorías
router.get('/', sessionAuth, UsuarioController.getAllUsuarios);
router.post('/',sessionAuth, UsuarioController.createUsuario);
router.put('/:id',sessionAuth, UsuarioController.updateUsuario);
router.delete('/:id',sessionAuth, UsuarioController.deleteUsuario);

export default router;
