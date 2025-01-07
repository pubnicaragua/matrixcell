export class Usuario {
    usuario_id: string | null;  // 'usuario_id' podría ser el ID de Supabase 'auth.users' o 'profile.auth_id'
    nombre: string | null;
    email: string | null;
    fecha_creacion: Date | string | null;
    rol_id: string | null;
    rol_nombre: string | null;  // El nombre del rol del usuario
    permisos: string[];  // Lista de permisos asociados al rol
  
    constructor() {
      this.usuario_id = null;
      this.nombre = null;
      this.email = null;
      this.fecha_creacion = null;
      this.rol_id = null;
      this.rol_nombre = null;
      this.permisos = [];
    }
  }