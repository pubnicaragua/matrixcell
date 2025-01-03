import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

// Ruta de inicio de sesión
router.post("/login", AuthController.login);
// Ruta para cambiar la contraseña
router.post("/change-password", AuthController.changePassword);
router.post('/reset-password', AuthController.resetPassword);
export default router;
