import { TechnicalServiceController } from "../controllers/technicalService.controller";
import express from 'express';

const router = express.Router();

// Ruta para obtener todas las tiendas
router.get('/', TechnicalServiceController.getAllTechnicalServices);

// Ruta para crear una nueva tienda
router.post('/', TechnicalServiceController.createTechnicalService);

// Ruta para actualizar una tienda existente
router.put('/:id', TechnicalServiceController.updateTechnicalService);

// Ruta para eliminar una tienda
router.delete('/:id', TechnicalServiceController.deleteTechnicalService);


export default router;