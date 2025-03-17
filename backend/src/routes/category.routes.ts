import express from "express"
import { CategoryController } from "../controllers/category.controller"
import { sessionAuth } from "../middlewares/supabaseMidleware"

const router = express.Router()

// Ruta para obtener todas las categorías
router.get("/", sessionAuth, CategoryController.getAllCategories)

// Ruta para obtener una categoría por ID
router.get("/:id", sessionAuth, CategoryController.getCategoryById)

export default router

