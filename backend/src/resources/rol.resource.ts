import { Rol } from "../models/rol.model";


export const RolResource = {
    formatRol(rol: Rol) {
        return {
            id: rol.rol_id,
            nombre: rol.nombre,
        };
    },

    formatRols(rols: Rol[]) {
        return rols.map(rol => RolResource.formatRol(rol));
    }
};
