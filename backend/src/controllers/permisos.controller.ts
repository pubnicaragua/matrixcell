import { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import { BaseService } from '../services/base.service.js';
import { Permission } from "../models/permission.model";
import { RolePermission } from "../models/rolePermission.model";

export const PermisoController = {
    async store(req: Request, res: Response) {
        try {
            // Obtener los datos del cuerpo de la solicitud
            const { name, role_id, userId } = req.body;
            if (!name || !role_id) {
                throw new Error(`Los campos name y role_id son obligatorios`);
            }
            // Insertar en la tabla de permisos
            const permissionData = await BaseService.create<Permission>('permissions', { name }, userId)
            // Obtener el ID del permiso insertado
            const permisoId = permissionData.id ? permissionData.id : 0;
            // Insertar en la tabla de roles_permisos (relación entre rol y permiso)
            await BaseService.create<RolePermission>('role_permissions', { role_id: role_id, permission_id: permisoId }, userId)
            // Responder con éxito
            res.status(201).json({ message: 'Datos almacenados correctamente', permisoId });
        } catch (error: any) {
            // Manejo de errores
            res.status(500).json({ error: error.message });
        }
    }
}