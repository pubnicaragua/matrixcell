import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { validateDevice } from "../requests/device.request";
import { BaseService } from "../services/base.service";
import { DeviceResource } from "../resources/device.resource";
import supabase from "../config/supabaseClient";
import * as XLSX from 'xlsx';
import { sendPushNotification } from "../services/notifications";

const tableName = 'devices'; // Nombre de la tabla en la base de datos
export const DeviceController = {

    async getAllDevices(req: Request, res: Response) {
        try {
            const where = { ...req.query };
            const devices = await BaseService.getAll<Device>(tableName, ['id', 'created_at', 'imei', 'owner', 'store_id', 'status'], where);

            // Asegurarse de que `formatDevice` pueda manejar un arreglo de dispositivos
            res.json(devices.map(device => DeviceResource.formatDevice(device)));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
    

    async createDevice(req: Request, res: Response) {
        try {
            validateDevice(req.body); // Validar los datos
            const { userId } = req;
            const device = await BaseService.create<Device>(tableName, req.body, userId);
            res.status(201).json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateDevice(req.body); // Validar los datos
            const { userId } = req;
            const device = await BaseService.update<Device>(tableName, parseInt(id), req.body, userId);
            res.json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Device>(tableName, id, userId);
            res.json({ message: 'Device eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    async processMasiveDevices(req: Request, res: Response) {
        try {

            // Verifica si hay un archivo cargado
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }
            type DeviceRow = {
                imei: string;
                action: 'bloqueado' | 'desbloqueado';
            };
            // Lee el archivo Excel
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Usamos la primera hoja del archivo
            const sheetData: DeviceRow[] = XLSX.utils.sheet_to_json<DeviceRow>(workbook.Sheets[sheetName]);

            // Valida que el archivo tenga datos
            if (sheetData.length === 0) {
                res.status(400).json({ error: 'El archivo está vacío.' });
            }

            // Procesar cada fila (se espera que tenga las columnas "imei" y "action")
            const results: { imei: string; status: string }[] = [];
            for (const row of sheetData) {
                const imei = row['imei'];
                const action = row['action']; // "block" o "unblock"

                if (!imei || !['bloqueado', 'desbloqueado'].includes(action)) {
                    results.push({ imei, status: 'Datos inválidos.' });
                    continue;
                }

                // Lógica para bloquear/desbloquear el dispositivo (Supabase u otro servicio)
                const { error } =
                    action === 'bloqueado'
                        ? await supabase.from('devices').update({ status: 'Bloqueado' }).eq('imei', imei)
                        : await supabase.from('devices').update({ status: 'Desbloqueado' }).eq('imei', imei);

                if (error) {
                    results.push({ imei, status: `Error: ${error.message}` });
                } else {
                    results.push({ imei, status: `${action === 'bloqueado' ? 'Bloqueado' : 'Desbloqueado'} exitosamente` });
                }
            }

            res.status(200).json({ message: 'Procesamiento completo.', results });
        } catch (error) {
            console.error('Error al procesar dispositivos:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },
    async blockDevices(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
             res.status(400).json({ success: false, message: 'El ID del dispositivo es requerido.' });
        }

        try {
            // Actualizar el estado del dispositivo a "blocked"
            const { data: device, error } = await supabase
                .from('devices')
                .update({ status: 'Bloqueado' })
                .eq('id', id)
                .select('push_token')
                .single();

            if (error) {
                console.error('Error al actualizar el estado del dispositivo:', error);
                res.status(500).json({ success: false, message: 'Error al bloquear el dispositivo en la base de datos.' });
            }

            if (!device) {
                res.status(404).json({ success: false, message: 'Dispositivo no encontrado.' });
            }

            // Obtener el push_token del dispositivo bloqueado
            const pushToken = device?.push_token;

            // Enviar notificación si el push_token existe
            if (pushToken) {
                const message = {
                    body: 'Tu dispositivo ha sido bloqueado. Por favor, realiza el pago para desbloquearlo.',
                    data: { deviceId: id },
                };

                try {

                     await sendPushNotification([pushToken], message);
                } catch (notificationError) {
                    console.error('Error enviando notificación push:', notificationError);
                     res.status(500).json({
                        success: false,
                        message: 'El dispositivo fue bloqueado, pero no se pudo enviar la notificación.'
                    });
                }
            }

             res.status(200).json({
                success: true,
                message: 'Dispositivo bloqueado y notificación enviada correctamente.'
            });

        } catch (error) {
            console.error('Error bloqueando el dispositivo:', error);
             res.status(500).json({ success: false, message: 'Error bloqueando el dispositivo.' });
        }
    }

}