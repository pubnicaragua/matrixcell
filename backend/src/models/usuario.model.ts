export class Usuario {
    usuario_id: number | null;
    nombre: string | null;
    email: string | null;
    fecha_creacion: Date | null;
    constructor() {
        this.usuario_id = null;
        this.nombre = null;
        this.email = null;
        this.fecha_creacion = null;
    }
  }