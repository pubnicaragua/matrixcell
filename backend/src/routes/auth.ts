import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { sessionAuth } from '../middlewares/supabaseMidleware';

const router = express.Router();

// Ruta de inicio de sesión
router.post("/login", AuthController.login);
router.post("/logout", sessionAuth,AuthController.logut);
// Ruta para cambiar la contraseña
router.post("/update-password", AuthController.updatePassword);
router.post("/change-password", AuthController.changePassword);
router.post('/reset-password', AuthController.resetPassword);
export default router;
