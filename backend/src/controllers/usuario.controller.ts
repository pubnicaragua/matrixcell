import { Usuario } from '../models/usuario.model.js';
import { Request, Response } from 'express';
import { UsuarioResource } from '../resources/usuario.resource.js';
import { BaseService } from '../services/base.service.js';
import supabaseAdmin from '../config/supabaseClientAdmin.js';

const tableName = 'usuarios'; // Nombre de la tabla en la base de datos

export const UsuarioController = {
  async getAllUsuarios(req: Request, res: Response) {
    try {
        // Consulta directamente la tabla auth.users
        const { data: usuarios, error } = await supabaseAdmin
            .auth
            .admin
            .listUsers(); // Función administrativa para listar usuarios

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Filtrar los usuarios con el rol 'authenticated' en user_metadata
        const usuariosAutenticados = usuarios.filter((usuario: { user_metadata: {id:number, role: string,email:string }; }) => 
            usuario.user_metadata && usuario.user_metadata.role === 'authenticated'
        );

        // Si no hay usuarios autenticados
        if (usuariosAutenticados.length === 0) {
            return res.status(404).json({ message: 'No authenticated users found.' });
        }

        // Responder solo con los usuarios autenticados
        res.json(usuariosAutenticados);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


};
