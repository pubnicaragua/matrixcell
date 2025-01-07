import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/usuario.model';
import supabaseAdmin from '../config/supabaseClientAdmin'; // Cliente admin de Supabase

const UsuarioController = {
  // Modificamos para obtener solo el usuario autenticado
  async getAuthenticatedUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data: userData, error } = await supabaseAdmin.auth.getUser();

      if (error || !userData) {
        // Cambié el return por res.status().json() directamente
        res.status(401).json({ message: 'No autenticado o token inválido', error: error?.message });
        return; // Aquí terminamos la ejecución de la función
      }

      const user = userData.user;

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return; // Aquí terminamos la ejecución de la función
      }

      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profile')
        .select('name, rol_id')
        .eq('auth_id', user.id)
        .single();

      if (profileError) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: profileError.message });
        return; // Aquí terminamos la ejecución de la función
      }

      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('name')
        .eq('id', profileData?.rol_id)
        .single();

      if (roleError) {
        res.status(500).json({ message: 'Error al obtener el rol', error: roleError.message });
        return; // Aquí terminamos la ejecución de la función
      }

      const { data: permissionsData, error: permissionsError } = await supabaseAdmin
        .from('role_permissions')
        .select('permissions(name)')
        .eq('role_id', profileData?.rol_id);

      if (permissionsError) {
        res.status(500).json({ message: 'Error al obtener permisos del rol', error: permissionsError.message });
        return; // Aquí terminamos la ejecución de la función
      }

      const permissionsList = permissionsData
        ? permissionsData.flatMap((item) => item.permissions.map((permission) => permission.name))
        : [];

      const usuario = new Usuario();
      usuario.usuario_id = user.id;
      usuario.nombre = profileData?.name || '';
      usuario.email = user.email || '';
      usuario.fecha_creacion = user.created_at || new Date();
      usuario.rol_id = profileData?.rol_id || '';
      usuario.rol_nombre = roleData?.name || '';
      usuario.permisos = permissionsList;

      // Cambié el return por res.json() directamente
      res.json(usuario); // Ya no es necesario retornar la respuesta
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      res.status(500).json({ message: 'Error al obtener el usuario autenticado', error: errorMessage });
    }
  },
};

export { UsuarioController };
