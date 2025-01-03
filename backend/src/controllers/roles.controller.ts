import { Request, Response } from 'express';
import { BaseService } from '../services/base.service';
import { RolResource } from '../resources/rol.resource';
import { Rol } from '../models/rol.model';
import supabase from '../config/supabaseClient';

const tableName = 'roles'; // Nombre de la tabla en la base de datos

export const RolController = {
    async getAllRols(req: Request, res: Response) {
        try {
            // Consulta para obtener roles y permisos relacionados
           /* const { data: rolesWithPermissions, error } = await supabase
            .from("roles")
            .select(`
              rol_id,
              nombre,
              role_permissions:role_permissions(
                permissions:permissions(
                  id,
                  name
                )
              )
            `)
            .neq("rol_id", 1); */
            const { data: rolesWithPermissions, error } = await supabase
            .from("roles")
            .select(`
              rol_id,
              nombre
            `)
            .neq("rol_id", 1); // Excluir el rol con rol_id = 1

            if (error) {
                throw new Error(error.message);
            }

            // Formatear los datos
            const formattedRoles = rolesWithPermissions.map((role) => ({
                id: role.rol_id,
                nombre: role.nombre,
               // permissions: role.role_permissions.map((rp: any) => rp.permissions),
            }));

            res.json(formattedRoles);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
    async assign(req: Request, res: Response) {
        try {
            const { userId, role } = req.body;
            const { data: rol } = await supabase.from(tableName).select('*').eq('role_id', role);
            const { data, error } = await supabase.from(tableName).insert([{ user_id: userId, role_id: role }]).select();
            res.json(rol);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
