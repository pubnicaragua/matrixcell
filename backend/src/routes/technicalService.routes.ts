import { TechnicalServiceController } from "../controllers/technicalService.controller";
import express from 'express';
import { sessionAuth } from "../middlewares/supabaseMidleware";

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/',sessionAuth, TechnicalServiceController.getAllTechnicalServices);

// Ruta para crear una nueva tienda
router.post('/',sessionAuth, TechnicalServiceController.createTechnicalService);

// Ruta para actualizar una tienda existente
router.put('/:id',sessionAuth, TechnicalServiceController.updateTechnicalService);

// Ruta para eliminar una tienda
router.delete('/:id',sessionAuth, TechnicalServiceController.deleteTechnicalService);


export default router;