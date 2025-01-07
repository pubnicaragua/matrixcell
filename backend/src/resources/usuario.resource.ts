import { Usuario } from "../models/usuario.model";


export const UsuarioResource = {
    formatUsuario(usuario: Usuario) {
        return {
            id: usuario.usuario_id,
            nombre: usuario.nombre,
            email: usuario.email,
            fecha_creacion: usuario.fecha_creacion,
        };
    },

    formatUsuarios(usuarios: Usuario[]) {
        return usuarios.map(usuario => UsuarioResource.formatUsuario(usuario));
    }
};
