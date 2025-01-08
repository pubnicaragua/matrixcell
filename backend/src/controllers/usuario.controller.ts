import { Usuario } from '../models/usuario.model.js';
import { Request, Response } from 'express';
import { UsuarioResource } from '../resources/usuario.resource.js';
import { BaseService } from '../services/base.service.js';
import supabaseAdmin from '../config/supabaseClientAdmin.js';
import supabase from '../config/supabaseClient.js';

const tableName = 'profile'; // Nombre de la tabla en la base de datos

export const UsuarioController = {
    async getAllUsuarios(req: Request, res: Response) {
        try {
            // Consulta directamente la tabla auth.users
            const { data: usuarios, error } = await supabaseAdmin.auth.admin.listUsers();
    
            if (error) {
                 res.status(400).json({ message: error.message });
            }
    
            // Consulta los perfiles de la base de datos
            const perfiles = await BaseService.getAll<any>(
                tableName,
                ['id', 'name', 'rol_id', 'roles(name)', 'auth_id']
            );
    
            // Función para obtener los permisos de un rol
            const obtenerPermisosPorRol = async (rolId: number) => {
                const { data: permissions, error: permissionsError } = await supabase
                    .from("role_permissions")
                    .select("permissions(name)")
                    .eq("role_id", rolId);
    
                if (permissionsError) {
                    console.error(`Error al obtener permisos para rol_id ${rolId}:`, permissionsError.message);
                    return [];
                }
    
                // Extraer solo los nombres de los permisos
                return permissions.map((p: any) => p.permissions.name);
            };
    
            // Unificar los usuarios con sus perfiles y permisos
            const usuariosConPerfilesYPermisos = await Promise.all(
                usuarios?.users.map(async usuario => {
                    const perfil = perfiles.find(p => p.auth_id === usuario.id);
    
                    if (perfil) {
                        const permisos = await obtenerPermisosPorRol(perfil.rol_id);
                        return {
                            ...usuario,
                            perfil: {
                                rol_id: perfil.rol_id,
                                roles: perfil['roles'],
                                name: perfil.name,
                                permisos,
                            },
                        };
                    }
    
                    return {
                        ...usuario,
                        perfil: null,
                    };
                })
            );
    
            // Responder con los usuarios autenticados, sus perfiles y permisos
            res.json(usuariosConPerfilesYPermisos);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    




};
