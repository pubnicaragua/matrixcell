import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { validateStore } from "../requests/store.request";
import { BaseService } from "../services/base.service";
import { StoreResource } from "../resources/store.resource";
import { URL_RESET_PASSWORD } from '../config/gobal';

import supabase from "../config/supabaseClient";
import Joi from "joi";
const PasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    token: Joi.string().min(6).required(),
    refreshToken: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
export const AuthController = {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            // Autenticar al usuario en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError || !authData.user) {
                throw new Error(authError?.message || "Autenticación fallida");
            }

            const userId = authData.user.id;

            // Consultar la información del usuario con su `rol_id`
            const { data: usuarioData, error: usuarioError } = await supabase
                .from("profile")
                .select("name,created_at, rol_id, roles(nombre)")
                .eq("auth_id", userId)
                .single();

            if (usuarioError) {
                throw new Error("Usuario no encontrado en la tabla 'usuarios': " + usuarioError.message);
            }

            const rolId = usuarioData.rol_id;

            // Consultar los permisos asociados al `rol_id`
          /*  const { data: permissions, error: permissionsError } = await supabase
                .from("role_permissions")
                .select("permissions(name)")
                .eq("role_id", rolId);

            if (permissionsError) {
                throw new Error("Error al obtener permisos: " + permissionsError.message);
            }

            // Extraer los nombres de los permisos
            const permissionsList = (permissions as { permissions: { name: string }[] }[])
                .flatMap((item) => item.permissions)
                .map((permission) => permission.name);*/
            res.status(200).json({
                message: "Inicio de sesión exitoso",
                user: authData.user,
                usuario: usuarioData,
               // permissions: permissionsList,
                token: authData.session?.access_token || "",
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            res.status(500).json({
                message: "Error interno del servidor",
                error: errorMessage,
            });
        }
    },
    async changePassword(req: Request, res: Response) {
        let responseSent = false; // Bandera para rastrear si se envió una respuesta

        try {
            // Validar la estructura de la solicitud
            const { error: validationError, value } = PasswordSchema.validate(req.body);

            if (validationError) {
                res.status(400).json({ error: validationError.details[0].message });
                responseSent = true; // Marcar respuesta como enviada
            }

            if (!responseSent) {
                // Establecer la sesión con Supabase
                const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
                    access_token: value.token,
                    refresh_token: value.refreshToken,
                });

                if (setSessionError) {
                    res.status(400).json({ error: setSessionError.message });
                    responseSent = true; // Marcar respuesta como enviada
                }

                if (!responseSent) {
                    // Cambiar la contraseña del usuario
                    const { data: updateData, error: passwordError } = await supabase.auth.updateUser({
                        password: value.newPassword,
                    });

                    if (passwordError) {
                        res.status(400).json({ error: passwordError.message });
                        responseSent = true; // Marcar respuesta como enviada
                    }

                    if (!responseSent) {
                        // Respuesta exitosa
                        res.status(200).json({
                            message: "Contraseña cambiada exitosamente.",
                            user: updateData,
                        });
                        responseSent = true; // Marcar respuesta como enviada
                    }
                }
            }
        } catch (err) {
            if (!responseSent) {
                res.status(500).json({
                    error: "Error interno del servidor.",
                    details: (err as Error).message || "Ocurrió un error desconocido.",
                });
            }
        }
    },
    async resetPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            // Enviar el correo de restablecimiento de contraseña con Supabase
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: URL_RESET_PASSWORD });

            if (error) {
                res.status(400).json({ error: error.message });
            }

            res.status(200).json({ message: 'Check your email for the reset link.' });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}