import type { Request, Response } from "express"
import { BaseService } from "../services/base.service.js"
import supabaseAdmin from "../config/supabaseClientAdmin.js"
import supabase from "../config/supabaseClient.js"

const tableName = "profile" // Nombre de la tabla en la base de datos

export const UsuarioController = {
    async getAllUsuarios(req: Request, res: Response) {
        try {
            // Consulta directamente la tabla auth.users
            const { data: usuarios, error } = await supabaseAdmin.auth.admin.listUsers()

            if (error) {
                res.status(400).json({ message: error.message })
            }

            // Consulta los perfiles de la base de datos
            const perfiles = await BaseService.getAll<any>(tableName, [
                "id",
                "name",
                "rol_id",
                "roles(name)",
                "auth_id",
                "store_id",
                "store(name)",
            ])

            console.log(perfiles)

            // Función para obtener los permisos de un rol
            const obtenerPermisosPorRol = async (rolId: number) => {
                const { data: permissions, error: permissionsError } = await supabase
                    .from("role_permissions")
                    .select("permissions(name)")
                    .eq("role_id", rolId)

                if (permissionsError) {
                    console.error(`Error al obtener permisos para rol_id ${rolId}:`, permissionsError.message)
                    return []
                }

                // Extraer solo los nombres de los permisos
                return permissions.map((p: any) => p.permissions.name)
            }

            // Unificar los usuarios con sus perfiles y permisos
            const usuariosConPerfilesYPermisos = await Promise.all(
                usuarios?.users.map(async (usuario) => {
                    const perfil = perfiles.find((p) => p.auth_id === usuario.id)

                    if (perfil) {
                        const permisos = await obtenerPermisosPorRol(perfil.rol_id)
                        return {
                            ...usuario,
                            perfil: {
                                rol_id: perfil.rol_id,
                                store_id: perfil.store_id,
                                roles: perfil["roles"],
                                store: perfil["store"],
                                name: perfil.name,
                                permisos,
                            },
                        }
                    }

                    return {
                        ...usuario,
                        perfil: null,
                    }
                }),
            )

            // Responder con los usuarios autenticados, sus perfiles y permisos
            res.json(usuariosConPerfilesYPermisos)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
    async createUsuario(req: Request, res: Response) {
        try {
            const { data, error } = await supabaseAdmin.auth.signUp({
                email: req.body.email,
                password: req.body.password,
            })
            if (error) throw new Error(error.message)

            const perfil = {
                name: req.body.name,
                auth_id: data.user?.id,
                rol_id: Number.parseInt(req.body.rol_id),
                store_id: Number.parseInt(req.body.store_id),
            }
            console.log(perfil)

            const { data: profile, error: errorProfile } = await supabase.from("profile").insert(perfil).select()

            if (errorProfile) throw new Error(errorProfile.message)
            console.log(data)
            res.json(data)
        } catch (error) {
            console.error("An error occurred:", error)
            res.status(500).json({ error: error })
        }
    },
    async updateUsuario(req: Request, res: Response) {
        try {
            const { id } = req.params
            const updatedData = req.body
            const { error, data } = await supabaseAdmin.auth.admin.updateUserById(id, { email: updatedData.email })

            const profileUpdate = {
                name: updatedData.name,
                rol_id: Number.parseInt(updatedData.rol_id),
                store_id: Number.parseInt(updatedData.store_id),
            }

            const { data: profile, error: errorProfile } = await supabase
                .from("profile")
                .update(profileUpdate)
                .eq("auth_id", id)
                .select()

            console.log(updatedData)
            if (error) {
                throw new Error(error.message)
            }
            if (errorProfile) throw new Error(errorProfile.message)
            res.json(data)
        } catch (error) {
            console.error("An error occurred:", error)
            res.status(500).json({ error: error })
        }
    },
    async deleteUsuario(req: Request, res: Response) {
        try {
            const { id } = req.params
            const updatedData = req.body
            const { error, data } = await supabaseAdmin.auth.admin.deleteUser(id)
            const { data: profile, error: errorProfile } = await supabase.from(tableName).delete().eq("auth_id", id)
            if (error) throw new Error(error.message)
            if (errorProfile) {
                throw new Error(errorProfile.message)
            }
            res.json("Se ha eliminado exitosamente")
        } catch (error) {
            console.error("An error occurred:", error)
            throw error
        }
    },
}

