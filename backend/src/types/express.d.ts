// express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // ID del usuario
      user?: any; // Datos completos del usuario, puedes especificar el tipo exacto
    }
  }
}
