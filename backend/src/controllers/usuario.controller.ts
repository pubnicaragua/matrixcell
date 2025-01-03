import { Usuario } from '../models/usuario.model.js';
import { Request, Response } from 'express';
import { UsuarioResource } from '../resources/usuario.resource.js';
import { BaseService } from '../services/base.service.js';
import supabase from '../config/supabaseClient.js';

const tableName = 'usuarios'; // Nombre de la tabla en la base de datos

export const UsuarioController = {
    async getAllUsuarios(req: Request, res: Response) {
        try {
            const { data: usuarios, error } = await supabase.from(tableName).select('*').neq('rol_id', 1);
            ;
            res.json(usuarios);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
};
