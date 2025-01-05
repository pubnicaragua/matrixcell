import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import supabase from "../config/supabaseClient";
import { BaseService } from "../services/base.service";

// Middleware para extraer el ID del usuario desde el token
export const sessionAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided')
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new Error('Invalid token')
    }
    // Agregar el ID del usuario al objeto `req`
    req.userId = data?.user?.id;
    next();
  } catch (error: any) {
    res.status(500).send(error.message);
  }

};
